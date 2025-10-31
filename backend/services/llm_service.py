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
        """Generate game categories using LLM with duplicate detection"""
        try:
            # Check cache first
            cache_key = f"{count}"
            if cache_key in self.category_cache:
                logger.info(f"Using cached categories for {count} categories")
                return self.category_cache[cache_key]
            
            # Generate extra categories (small buffer) to account for duplicates that will be filtered
            # For large counts (208+), use a smaller percentage to avoid generating too many
            if count >= 200:
                extra_count = 15  # Just 15 extra for 2 decks
            else:
                extra_count = max(int(count * 0.15), 10)  # 15% buffer, at least 10 extra
            total_to_generate = count + extra_count
            logger.info(f"Generating {total_to_generate} categories (requested: {count}, buffer: {extra_count})")
            
            if self.openai_client:
                # Use OpenAI to generate categories (with buffer)
                all_categories = self._generate_with_openai(total_to_generate)
            else:
                # Fallback to predefined categories
                all_categories = self._generate_fallback_categories(total_to_generate)
            
            # Filter duplicates and similar categories using hard-coded checks
            unique_categories = self._filter_duplicates(all_categories, count)
            
            # Cache the results
            self.category_cache[cache_key] = unique_categories
            
            logger.info(f"Generated {len(unique_categories)} unique categories (filtered from {len(all_categories)})")
            return unique_categories
            
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
            
            ABSOLUTE DUPLICATE PROHIBITIONS (CRITICAL - DO NOT VIOLATE):
            - Do NOT repeat any category name exactly
            - Do NOT use variations like "Car Brand" and "Automobile Brand" 
            - Do NOT use similar concepts like "Fruit" and "Citrus Fruit"
            - Do NOT use same base word with different suffixes/prefixes: 
              * "Board Game", "Board Game Accessory", "Board Game Cooperative Mode", "Board Game Publisher" - ONLY ONE allowed total
              * "Video Game", "Video Game Console", "Video Game Character" - ONLY ONE allowed total
              * "Card Game", "Card Game Type", "Card Game Variant" - ONLY ONE allowed total
            - If you use "Board Game", you CANNOT use ANY other "Board Game X" variation in the same list
            - Each category must be from a COMPLETELY DIFFERENT domain/subject area
            - Maximum ONE category per base word/theme (e.g., only ONE board game related category TOTAL)
            
            GENRE DIVERSITY REQUIREMENTS:
            - Spread categories across MANY different themes/genres
            - Do NOT cluster similar themes (e.g., avoid multiple board game, food, or animal categories)
            - MAXIMUM 1 category per theme/genre (e.g., only 1 board game category TOTAL, 1 food category TOTAL, etc.)
            - Mix categories from: food, entertainment, nature, technology, sports, geography, science, arts, etc.
            - Ensure variety in subject matter and difficulty level
            - Each category must be from a DIFFERENT domain/subject area
            
            FORMAT REQUIREMENTS:
            - Do NOT start categories with "Type of" (e.g., avoid "Type of Cheese", use "Cheese" instead)
            - Do NOT start categories with "Kind of" (e.g., avoid "Kind of Bird", use "Bird" instead)
            - Do NOT start categories with "Brand of" (e.g., avoid "Brand of Chocolate", use "Chocolate Brand" instead)
            - Use direct, concise category names
            
            CRITICAL: Categories must be REAL THINGS that exist in the world, not abstract concepts or themes.
            
            EXCELLENT examples (real, concrete things people can name):
            
            FOOD & DRINK: "Shampoo Brand", "Fast Food Chain", "Soda Brand", "Candy Bar", "Ice Cream Flavor", "Spicy Food", "Cheese", "Pizza Topping", "Breakfast Cereal", "Coffee Brand"
            
            NATURE & ANIMALS: "Dog Breed", "Fruit", "Flower", "Bird", "Fish", "Tree", "Insect", "Mammal", "Reptile", "Ocean Animal"
            
            ENTERTAINMENT: "Movie Genre", "Musical Instrument", "Board Game", "Superhero", "Disney Princess", "TV Show", "Book Genre", "Song Title", "Actor", "Singer"
            
            TECHNOLOGY: "Car Brand", "Video Game Console", "Social Media Platform", "App", "Website", "Phone Brand", "Computer Brand", "Software", "Operating System"
            
            GEOGRAPHY: "City in California", "Country in Europe", "Famous Landmark", "Mountain", "River", "Ocean", "Desert", "Island", "Capital City", "State"
            
            SPORTS & ACTIVITIES: "Sport", "Outdoor Activity", "Exercise", "Hobby", "Olympic Sport", "Team Sport", "Individual Sport", "Water Sport", "Winter Sport"
            
            SCIENCE: "Element on Periodic Table", "Planet", "Chemical", "Disease", "Invention", "Scientist", "Medical Condition", "Body Part", "Organ", "Bone"
            
            ARTS & CULTURE: "Art Style", "Music Genre", "Dance Style", "Architecture Style", "Literary Genre", "Painter", "Composer", "Writer", "Artist", "Musician"
            
            DAILY LIFE: "Kitchen Appliance", "Clothing Item", "Tool", "Household Item", "Office Supply", "Furniture", "Vehicle", "Building", "Room in House", "School Subject"
            
            ABSOLUTELY FORBIDDEN - DO NOT USE THESE BAD CATEGORIES:
            - "Board Game Accessory" (vague - what accessories? people can't name these quickly)
            - "Board Game Cooperative Mode" (not a real thing people can name examples of)
            - "Board Game Theme" (not a real thing people can name)
            - "Board Game Token" (not a real thing people can name)
            - "Board Game Publisher" (too niche - most people don't know these)
            - "Board Game App" (too specific/narrow)
            - "Game Piece" (too vague)
            - "Brand" (too broad - could be anything)
            - "Food" (too broad)
            - "Colors" (too easy)
            - "Things" (meaningless)
            - "Stuff" (meaningless)
            - "Items" (too vague)
            - "Objects" (too vague)
            - "Theme" (abstract concept)
            - "Style" (too abstract)
            - "Genre" (too abstract without context)
            - "Category" (meta-category, not real)
            - "Concept" (too abstract)
            - "Idea" (too abstract)
            - "Mode" (abstract - what mode?)
            - "Accessory" (too vague - accessory to what?)
            
            CRITICAL: Categories must be things people can INSTANTLY name 3+ examples of without thinking.
            
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
    
    def _filter_duplicates(self, categories: List[Dict[str, Any]], target_count: int) -> List[Dict[str, Any]]:
        """Filter out duplicates and similar categories using hard-coded checks
        
        Args:
            categories: List of category dictionaries with 'category' key
            target_count: Number of unique categories needed
            
        Returns:
            List of unique categories, filtered to target_count
        """
        import re
        
        # Extract category names
        category_names = [cat.get("category", "") if isinstance(cat, dict) else str(cat) for cat in categories]
        
        # Normalize category names for comparison (lowercase, remove extra spaces)
        def normalize_category(cat: str) -> str:
            return re.sub(r'\s+', ' ', cat.strip().lower())
        
        # Extract base words for similarity checking
        def get_base_words(cat: str) -> List[str]:
            """Extract meaningful base words from a category"""
            normalized = normalize_category(cat)
            # Split by common separators
            words = re.split(r'[\s\-_]+', normalized)
            # Filter out common stop words
            stop_words = {'of', 'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'and', 'or', 'but'}
            base_words = [w for w in words if w and w not in stop_words and len(w) > 2]
            return base_words
        
        # Check if two categories are too similar
        def are_similar(cat1: str, cat2: str) -> bool:
            """Check if two categories are too similar (hard-coded logic)"""
            norm1 = normalize_category(cat1)
            norm2 = normalize_category(cat2)
            
            # Exact match (case-insensitive)
            if norm1 == norm2:
                return True
            
            # AGGRESSIVE check for problematic base word patterns - if both start with same problematic base, they're duplicates
            problematic_base_words = [
                'board game', 'video game', 'card game', 'pizza', 'coffee', 
                'chocolate', 'car brand', 'phone brand', 'computer brand'
            ]
            
            for base_word in problematic_base_words:
                # If BOTH categories start with the problematic base word, they're duplicates
                # This catches "board game" vs "board game accessory" vs "board game mode" etc.
                if norm1.startswith(base_word) and norm2.startswith(base_word):
                    # They both start with the same problematic base - ALWAYS consider duplicates
                    # Even if suffixes are different, they're too similar
                    return True
                
                # Also check if base word appears anywhere in both (catch variations)
                if base_word in norm1 and base_word in norm2:
                    # Check if one is exactly the base word and the other is base word + something
                    if norm1 == base_word and norm2.startswith(base_word) and norm2 != base_word:
                        return True
                    if norm2 == base_word and norm1.startswith(base_word) and norm1 != base_word:
                        return True
            
            # Check if one contains the other (cat1 contains cat2 or vice versa)
            if len(norm1) > 10 and len(norm2) > 10:
                if norm1 in norm2 or norm2 in norm1:
                    shorter = norm1 if len(norm1) < len(norm2) else norm2
                    longer = norm2 if shorter == norm1 else norm1
                    # If shorter is more than just a word and appears in longer, likely duplicate
                    if len(shorter.split()) > 1 and shorter in longer:
                        return True
            
            # Check base words - if they share significant base words, they're similar
            base1 = get_base_words(cat1)
            base2 = get_base_words(cat2)
            
            if not base1 or not base2:
                return False
            
            # Count overlapping significant words (3+ characters)
            significant_base1 = [w for w in base1 if len(w) >= 3]
            significant_base2 = [w for w in base2 if len(w) >= 3]
            
            if not significant_base1 or not significant_base2:
                return False
            
            # Check if all significant words from the shorter list are in the longer
            if len(significant_base1) <= len(significant_base2):
                if all(word in significant_base2 for word in significant_base1):
                    shorter_cat = norm1 if len(norm1) < len(norm2) else norm2
                    longer_cat = norm2 if shorter_cat == norm1 else norm1
                    if longer_cat.startswith(shorter_cat) or longer_cat.endswith(shorter_cat):
                        return True
                    if len(shorter_cat.split()) >= 2 and shorter_cat in longer_cat:
                        return True
            else:
                if all(word in significant_base1 for word in significant_base2):
                    shorter_cat = norm2
                    longer_cat = norm1
                    if longer_cat.startswith(shorter_cat) or longer_cat.endswith(shorter_cat):
                        return True
                    if len(shorter_cat.split()) >= 2 and shorter_cat in longer_cat:
                        return True
            
            return False
        
        # Filter duplicates
        unique_categories: List[Dict[str, Any]] = []
        seen_normalized = set()
        duplicates_found = 0
        
        # Track problematic base words to ensure we only keep ONE per base word
        seen_base_words: Dict[str, str] = {}  # base_word -> category_name that used it
        
        for cat_dict in categories:
            cat_name = cat_dict.get("category", "") if isinstance(cat_dict, dict) else str(cat_dict)
            if not cat_name:
                continue
            
            norm_cat = normalize_category(cat_name)
            
            # Check if we've seen this exact category
            if norm_cat in seen_normalized:
                duplicates_found += 1
                logger.debug(f"Found exact duplicate: '{cat_name}'")
                continue
            
            # Check for problematic base words - only allow ONE category per base word
            problematic_base_words = [
                'board game', 'video game', 'card game', 'pizza', 'coffee', 
                'chocolate', 'car brand', 'phone brand', 'computer brand'
            ]
            
            base_word_conflict = False
            for base_word in problematic_base_words:
                if norm_cat.startswith(base_word):
                    # This category uses a problematic base word
                    if base_word in seen_base_words:
                        # We already have a category with this base word - reject this one
                        base_word_conflict = True
                        duplicates_found += 1
                        logger.info(f"Rejecting '{cat_name}' - already have '{seen_base_words[base_word]}' with base word '{base_word}'")
                        break
            
            if base_word_conflict:
                continue
            
            # Check if this category is similar to any we've already added
            is_duplicate = False
            for existing_cat in unique_categories:
                existing_name = existing_cat.get("category", "") if isinstance(existing_cat, dict) else str(existing_cat)
                if are_similar(cat_name, existing_name):
                    is_duplicate = True
                    duplicates_found += 1
                    logger.info(f"Found similar category: '{cat_name}' similar to '{existing_name}'")
                    break
            
            if not is_duplicate:
                unique_categories.append(cat_dict if isinstance(cat_dict, dict) else {"category": cat_name})
                seen_normalized.add(norm_cat)
                
                # Track which base words we've used
                for base_word in problematic_base_words:
                    if norm_cat.startswith(base_word):
                        seen_base_words[base_word] = cat_name
                        break
                
                # Stop if we have enough unique categories
                if len(unique_categories) >= target_count:
                    break
        
        logger.info(f"Filtered duplicates: {duplicates_found} duplicates found, {len(unique_categories)} unique categories kept")
        
        # If we don't have enough unique categories, return what we have
        if len(unique_categories) < target_count:
            logger.warning(f"Only found {len(unique_categories)} unique categories (requested {target_count})")
        
        return unique_categories[:target_count]
    
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