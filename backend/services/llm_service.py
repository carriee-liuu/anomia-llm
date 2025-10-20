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
        
        # Configuration
        self.cache_ttl_hours = 24
        self.max_retries = 3
        
        # Initialize OpenAI client if API key is available
        self.openai_client = None
        if self.openai_api_key:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=self.openai_api_key)
                logger.info("OpenAI client initialized successfully")
            except ImportError:
                logger.warning("OpenAI package not installed. Install with: pip install openai")
            except Exception as e:
                logger.error(f"Error initializing OpenAI client: {e}")
        else:
            logger.warning("No OpenAI API key found. LLM features will be limited.")
    
    def generate_categories_for_game(self, count: int) -> List[Dict[str, Any]]:
        """Generate game categories using LLM"""
        try:
            # Check cache first
            cache_key = f"{count}"
            if cache_key in self.category_cache:
                logger.info(f"Using cached categories for {count} categories")
                return self.category_cache[cache_key]
            
            if self.openai_client:
                # Use OpenAI to generate categories
                categories = self._generate_with_openai(count)
            else:
                # Fallback to predefined categories
                categories = self._generate_fallback_categories(count)
            
            # Cache the results
            self.category_cache[cache_key] = categories
            
            logger.info(f"Generated {len(categories)} categories")
            return categories
            
        except Exception as e:
            logger.error(f"Error generating categories: {e}")
            # Return fallback categories on error
            return self._generate_fallback_categories(count)
    
    # Note: Answer validation and example generation removed
    # This is an in-person game where players validate answers themselves
    
    def _generate_with_openai(self, count: int) -> List[Dict[str, Any]]:
        """Generate categories using OpenAI API"""
        try:
            prompt = f"""
            Generate {count} UNIQUE game categories for Anomia, a fast-paced word association party game where players must quickly name examples from categories.
            
            CRITICAL REQUIREMENTS:
            - ALL {count} categories must be COMPLETELY UNIQUE (no duplicates, no variations)
            - Each category must be SPECIFIC and CONCRETE (players need to name actual examples, not abstract concepts)
            - Universally accessible (most people know multiple examples)
            - Challenging but fair (requires quick thinking, not specialized knowledge)
            - Fun and engaging for all ages
            - Family-friendly content
            
            DUPLICATE PREVENTION:
            - Do NOT repeat any category name exactly
            - Do NOT use variations like "Car Brand" and "Automobile Brand" 
            - Do NOT use similar concepts like "Fruit" and "Citrus Fruit"
            - Each category must be distinctly different from all others
            
            GENRE DIVERSITY REQUIREMENTS:
            - Spread categories across MANY different themes/genres
            - Do NOT cluster similar themes (e.g., avoid multiple superhero, food, or animal categories)
            - Mix categories from: food, entertainment, nature, technology, sports, geography, science, arts, etc.
            - Ensure variety in subject matter and difficulty level
            
            FORMAT REQUIREMENTS:
            - Do NOT start categories with "Type of" (e.g., avoid "Type of Cheese", use "Cheese" instead)
            - Do NOT start categories with "Kind of" (e.g., avoid "Kind of Bird", use "Bird" instead)
            - Do NOT start categories with "Brand of" (e.g., avoid "Brand of Chocolate", use "Chocolate Brand" instead)
            - Use direct, concise category names
            
            EXCELLENT examples (diverse genres - mix these categories):
            
            FOOD & DRINK: "Shampoo Brand", "Fast Food Chain", "Soda Brand", "Candy Bar", "Ice Cream Flavor", "Spicy Food", "Cheese"
            
            NATURE & ANIMALS: "Dog Breed", "Fruit", "Flower", "Bird", "Fish", "Tree", "Insect"
            
            ENTERTAINMENT: "Movie Genre", "Musical Instrument", "Board Game", "Superhero", "Disney Princess", "TV Show", "Book Genre"
            
            TECHNOLOGY: "Car Brand", "Video Game Console", "Social Media Platform", "App", "Website"
            
            GEOGRAPHY: "City in California", "Country in Europe", "Famous Landmark", "Mountain", "River"
            
            SPORTS & ACTIVITIES: "Sport", "Outdoor Activity", "Exercise", "Hobby", "Game"
            
            SCIENCE: "Element on Periodic Table", "Planet", "Chemical", "Disease", "Invention"
            
            ARTS & CULTURE: "Art Style", "Music Genre", "Dance Style", "Architecture Style", "Literary Genre"
            
            DAILY LIFE: "Kitchen Appliance", "Clothing Item", "Tool", "Household Item", "Office Supply"
            
            AVOID these vague categories:
            - "Brand" (too broad - could be anything)
            - "Food" (too broad)
            - "Colors" (too easy)
            - "Things" (meaningless)
            - "Stuff" (meaningless)
            - "Items" (too vague)
            - "Objects" (too vague)
            
            Return EXACTLY {count} UNIQUE categories in this exact JSON format:
            [
                "Specific Category Name",
                "Another Unique Category",
                "Third Unique Category",
                ...
            ]
            
            IMPORTANT: 
            - Return ONLY the category names as strings
            - Ensure all {count} categories are completely unique
            - Response must be valid JSON array
            """
            
            response = self.openai_client.chat.completions.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are a creative game designer specializing in Anomia, a fast-paced word association party game. You excel at creating specific, concrete categories that players can immediately name examples for. Your categories are universally accessible but challenging enough to create exciting gameplay."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.8
            )
            
            # Parse the response
            content = response.choices[0].message.content
            logger.info(f"Raw OpenAI response: {content}")
            
            # Try to extract JSON from the response (in case there's extra text)
            import re
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                json_content = json_match.group(0)
            else:
                json_content = content
            
            logger.info(f"Extracted JSON: {json_content}")
            categories = json.loads(json_content)
            
            # Convert to expected format (now just strings)
            result = []
            for item in categories:
                if isinstance(item, str):
                    result.append({
                        "category": item,
                        "id": self._generate_id(),
                        "timestamp": datetime.now().isoformat(),
                        "source": "openai"
                    })
                elif isinstance(item, dict) and "category" in item:
                    # Fallback for old format
                    result.append({
                        "category": item["category"],
                        "id": self._generate_id(),
                        "timestamp": datetime.now().isoformat(),
                        "source": "openai"
                    })
            
            logger.info(f"Generated {len(result)} categories")
            return result
            
        except Exception as e:
            logger.error(f"Error generating with OpenAI: {e}")
            raise
    
    
    def _generate_fallback_categories(self, count: int) -> List[Dict[str, Any]]:
        """Generate fallback categories when LLM is not available - using real Anomia categories"""
        # Real Anomia game categories (specific but universally accessible)
        anomia_categories = [
            "Actor", "Actress", "Adjective", "African Animal", "Airline", "Alcoholic Drink", "Animal", 
            "Appliance", "Apparel", "Architectural Style", "Art Movement", "Astronomical Object", "Athlete",
            "Author", "Automobile", "Beverage", "Body Part", "Book", "Brand", "Candy", "Cartoon Character",
            "Celebrity", "Cereal", "Cheese", "Chewing Gum", "Child's Toy", "City", "Clothing Item", "Color",
            "Comic Strip", "Company", "Computer Game", "Country", "Dessert", "Dog Breed", "Drink", "Element",
            "Famous Athlete", "Famous Chef", "Famous Person", "Fictional Character", "Film", "Flower", "Food",
            "Fruit", "Game", "Gemstone", "Hair Style", "Holiday", "Ice Cream Flavor"
        ]
        
        # Randomly select the requested number of categories
        import random
        selected_categories = random.sample(anomia_categories, min(count, len(anomia_categories)))
        
        # Convert to the expected format
        result = []
        for category_name in selected_categories:
            result.append({
                "category": category_name,
                "description": f"Real Anomia category: {category_name}",
                "id": self._generate_id(),
                "timestamp": datetime.now().isoformat(),
                "source": "anomia_fallback"
            })
        
        return result
    
    
    def _generate_id(self) -> str:
        """Generate a unique ID"""
        import uuid
        return str(uuid.uuid4())
    
    def clear_cache(self):
        """Clear the content cache"""
        self.category_cache.clear()
        logger.info("LLM service cache cleared")
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get the current status of the LLM service"""
        return {
            "openai_available": self.openai_client is not None,
            "api_key_configured": bool(self.openai_api_key),
            "model": self.openai_model,
            "cache_size": {
                "categories": len(self.category_cache)
            },
            "timestamp": datetime.now().isoformat()
        } 