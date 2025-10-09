import logging
import os
from typing import Dict, List, Optional, Any
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class LLMService:
    """Service for AI/LLM integration"""
    
    def __init__(self):
        # OpenAI API configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        
        # Cache for generated content (in production, use Redis)
        self.category_cache: Dict[str, List[Dict[str, Any]]] = {}
        self.answer_cache: Dict[str, Dict[str, Any]] = {}
        
        # Configuration
        self.cache_ttl_hours = 24
        self.max_retries = 3
        
        # Initialize OpenAI client if API key is available
        self.openai_client = None
        if self.openai_api_key:
            try:
                import openai
                openai.api_key = self.openai_api_key
                self.openai_client = openai
                logger.info("OpenAI client initialized successfully")
            except ImportError:
                logger.warning("OpenAI package not installed. Install with: pip install openai")
            except Exception as e:
                logger.error(f"Error initializing OpenAI client: {e}")
        else:
            logger.warning("No OpenAI API key found. LLM features will be limited.")
    
    def generate_categories_for_game(self, count: int, difficulty: str = "medium") -> List[Dict[str, Any]]:
        """Generate game categories using LLM"""
        try:
            # Check cache first
            cache_key = f"{count}_{difficulty}"
            if cache_key in self.category_cache:
                logger.info(f"Using cached categories for {count} {difficulty} categories")
                return self.category_cache[cache_key]
            
            if self.openai_client:
                # Use OpenAI to generate categories
                categories = self._generate_with_openai(count, difficulty)
            else:
                # Fallback to predefined categories
                categories = self._generate_fallback_categories(count, difficulty)
            
            # Cache the results
            self.category_cache[cache_key] = categories
            
            logger.info(f"Generated {len(categories)} {difficulty} categories")
            return categories
            
        except Exception as e:
            logger.error(f"Error generating categories: {e}")
            # Return fallback categories on error
            return self._generate_fallback_categories(count, difficulty)
    
    def validate_answer(self, answer: str, category: str) -> Dict[str, Any]:
        """Validate if an answer is correct for a category using LLM"""
        try:
            # Check cache first
            cache_key = f"{answer}_{category}".lower()
            if cache_key in self.answer_cache:
                return self.answer_cache[cache_key]
            
            if self.openai_client:
                # Use OpenAI to validate answer
                validation_result = self._validate_with_openai(answer, category)
            else:
                # Fallback validation
                validation_result = self._validate_fallback(answer, category)
            
            # Cache the result
            self.answer_cache[cache_key] = validation_result
            
            return validation_result
            
        except Exception as e:
            logger.error(f"Error validating answer: {e}")
            # Return fallback validation on error
            return self._validate_fallback(answer, category)
    
    def generate_word_examples(self, category: str, count: int = 5) -> List[str]:
        """Generate example words for a category using LLM"""
        try:
            if self.openai_client:
                # Use OpenAI to generate examples
                examples = self._generate_examples_with_openai(category, count)
            else:
                # Fallback to predefined examples
                examples = self._generate_fallback_examples(category, count)
            
            logger.info(f"Generated {len(examples)} examples for category: {category}")
            return examples
            
        except Exception as e:
            logger.error(f"Error generating examples: {e}")
            # Return fallback examples on error
            return self._generate_fallback_examples(category, count)
    
    def _generate_with_openai(self, count: int, difficulty: str) -> List[Dict[str, Any]]:
        """Generate categories using OpenAI API"""
        try:
            prompt = f"""
            Generate {count} creative and engaging game categories for a word association game.
            Difficulty level: {difficulty}
            
            Each category should be:
            - Specific enough to be challenging
            - Broad enough to have many possible answers
            - Fun and engaging for players
            - Appropriate for the {difficulty} difficulty level
            
            Return the categories in this exact JSON format:
            [
                {{"category": "Category Name", "difficulty": "{difficulty}", "description": "Brief description"}},
                ...
            ]
            
            Make sure the response is valid JSON.
            """
            
            response = self.openai_client.ChatCompletion.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are a creative game designer specializing in word association games."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.8
            )
            
            # Parse the response
            content = response.choices[0].message.content
            categories = json.loads(content)
            
            # Add metadata
            for category in categories:
                category["id"] = self._generate_id()
                category["timestamp"] = datetime.now().isoformat()
                category["source"] = "openai"
            
            return categories
            
        except Exception as e:
            logger.error(f"Error generating with OpenAI: {e}")
            raise
    
    def _validate_with_openai(self, answer: str, category: str) -> Dict[str, Any]:
        """Validate answer using OpenAI API"""
        try:
            prompt = f"""
            Validate if the answer "{answer}" is correct for the category "{category}".
            
            Consider:
            - Is the answer relevant to the category?
            - Is it a valid example?
            - Is it appropriate for a family-friendly game?
            
            Return a JSON response in this exact format:
            {{
                "isValid": true/false,
                "confidence": 0.0-1.0,
                "reason": "Brief explanation",
                "suggestions": ["alternative1", "alternative2"]
            }}
            
            Make sure the response is valid JSON.
            """
            
            response = self.openai_client.ChatCompletion.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are a game referee validating answers in a word association game."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.3
            )
            
            # Parse the response
            content = response.choices[0].message.content
            validation = json.loads(content)
            
            # Add metadata
            validation["timestamp"] = datetime.now().isoformat()
            validation["source"] = "openai"
            
            return validation
            
        except Exception as e:
            logger.error(f"Error validating with OpenAI: {e}")
            raise
    
    def _generate_examples_with_openai(self, category: str, count: int) -> List[str]:
        """Generate example words using OpenAI API"""
        try:
            prompt = f"""
            Generate {count} example words for the category "{category}".
            
            Requirements:
            - Each word should be a valid example of the category
            - Words should be appropriate for a family-friendly game
            - Include a mix of common and creative examples
            - Each word should be 1-3 words maximum
            
            Return the examples as a JSON array:
            ["example1", "example2", "example3", ...]
            
            Make sure the response is valid JSON.
            """
            
            response = self.openai_client.ChatCompletion.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are a creative game designer providing examples for word categories."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            # Parse the response
            content = response.choices[0].message.content
            examples = json.loads(content)
            
            return examples
            
        except Exception as e:
            logger.error(f"Error generating examples with OpenAI: {e}")
            raise
    
    def _generate_fallback_categories(self, count: int, difficulty: str) -> List[Dict[str, Any]]:
        """Generate fallback categories when LLM is not available"""
        fallback_categories = {
            "easy": [
                {"category": "Types of Fruit", "difficulty": "easy", "description": "Common fruits everyone knows"},
                {"category": "Colors", "difficulty": "easy", "description": "Basic colors"},
                {"category": "Animals", "difficulty": "easy", "description": "Common animals"},
                {"category": "Foods", "difficulty": "easy", "description": "Everyday foods"},
                {"category": "Sports", "difficulty": "easy", "description": "Popular sports"}
            ],
            "medium": [
                {"category": "Famous Landmarks", "difficulty": "medium", "description": "Well-known places around the world"},
                {"category": "Movie Genres", "difficulty": "medium", "description": "Types of movies"},
                {"category": "Kitchen Appliances", "difficulty": "medium", "description": "Common kitchen tools"},
                {"category": "Musical Instruments", "difficulty": "medium", "description": "Instruments people play"},
                {"category": "Countries in Europe", "difficulty": "medium", "description": "European nations"}
            ],
            "hard": [
                {"category": "Famous Scientists", "difficulty": "hard", "description": "Important scientific figures"},
                {"category": "Chemical Elements", "difficulty": "hard", "description": "Elements from the periodic table"},
                {"category": "Classical Composers", "difficulty": "hard", "description": "Famous music composers"},
                {"category": "Ancient Civilizations", "difficulty": "hard", "description": "Historical societies"},
                {"category": "Space Missions", "difficulty": "hard", "description": "Famous space exploration"}
            ]
        }
        
        # Get categories for the specified difficulty
        available_categories = fallback_categories.get(difficulty, fallback_categories["medium"])
        
        # Return requested number of categories (or all available if count is higher)
        selected_categories = available_categories[:count]
        
        # Add metadata
        for category in selected_categories:
            category["id"] = self._generate_id()
            category["timestamp"] = datetime.now().isoformat()
            category["source"] = "fallback"
        
        return selected_categories
    
    def _validate_fallback(self, answer: str, category: str) -> Dict[str, Any]:
        """Fallback validation when LLM is not available"""
        # Simple validation logic
        is_valid = len(answer.strip()) >= 2 and len(answer.strip()) <= 50
        
        return {
            "isValid": is_valid,
            "confidence": 0.5,  # Lower confidence for fallback
            "reason": "Basic validation (LLM not available)",
            "suggestions": [],
            "timestamp": datetime.now().isoformat(),
            "source": "fallback"
        }
    
    def _generate_fallback_examples(self, category: str, count: int) -> List[str]:
        """Generate fallback examples when LLM is not available"""
        # Simple fallback examples based on category
        fallback_examples = {
            "Types of Fruit": ["Apple", "Banana", "Orange", "Grape", "Strawberry"],
            "Colors": ["Red", "Blue", "Green", "Yellow", "Purple"],
            "Animals": ["Dog", "Cat", "Bird", "Fish", "Lion"],
            "Foods": ["Pizza", "Burger", "Salad", "Soup", "Pasta"],
            "Sports": ["Soccer", "Basketball", "Tennis", "Swimming", "Running"]
        }
        
        # Try to find examples for the category
        examples = fallback_examples.get(category, ["Example 1", "Example 2", "Example 3"])
        
        # Return requested number of examples
        return examples[:count]
    
    def _generate_id(self) -> str:
        """Generate a unique ID"""
        import uuid
        return str(uuid.uuid4())
    
    def clear_cache(self):
        """Clear the content cache"""
        self.category_cache.clear()
        self.answer_cache.clear()
        logger.info("LLM service cache cleared")
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get the current status of the LLM service"""
        return {
            "openai_available": self.openai_client is not None,
            "api_key_configured": bool(self.openai_api_key),
            "model": self.openai_model,
            "cache_size": {
                "categories": len(self.category_cache),
                "answers": len(self.answer_cache)
            },
            "timestamp": datetime.now().isoformat()
        } 