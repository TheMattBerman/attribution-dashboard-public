import os
import json
import time
import requests
from typing import Dict, List, Optional, Any
import logging

class OpenRouterSentimentAnalyzer:
    """Enhanced sentiment analysis using OpenRouter API with multiple AI models"""
    
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        self.model = model or os.getenv('OPENROUTER_MODEL', 'google/gemini-2.0-flash-exp')
        self.base_url = 'https://openrouter.ai/api/v1'
        self.initialized = False
        self.fallback_enabled = True
        
        if self.api_key:
            self._initialize_openrouter()
        else:
            logging.warning("OpenRouter API key not found. Using fallback sentiment analysis.")
    
    def _initialize_openrouter(self):
        """Initialize OpenRouter API client"""
        try:
            # Test the API connection with a simple request
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # Make a simple test request to validate credentials
            test_response = requests.get(
                f'{self.base_url}/models',
                headers=headers,
                timeout=10
            )
            
            if test_response.status_code == 200:
                self.initialized = True
                logging.info(f"OpenRouter sentiment analyzer initialized successfully with model: {self.model}")
            else:
                logging.error(f"OpenRouter API test failed: {test_response.status_code}")
                self.initialized = False
                
        except Exception as e:
            logging.error(f"Failed to initialize OpenRouter: {e}")
            self.initialized = False
    
    def analyze_sentiment(self, text: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze sentiment of given text using OpenRouter AI models
        
        Args:
            text: Text to analyze
            context: Optional context (platform, brand, etc.)
            
        Returns:
            Dict with sentiment, confidence, reasoning, and categories
        """
        if not text or not text.strip():
            return self._get_neutral_result("Empty text")
        
        if self.initialized:
            try:
                return self._analyze_with_openrouter(text, context)
            except Exception as e:
                logging.error(f"OpenRouter analysis failed: {e}")
                if self.fallback_enabled:
                    return self._analyze_with_fallback(text)
                else:
                    return self._get_error_result(str(e))
        else:
            return self._analyze_with_fallback(text)
    
    def _analyze_with_openrouter(self, text: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Perform sentiment analysis using OpenRouter API"""
        
        # Construct prompt with context
        brand_name = context.get('brand', 'the brand') if context else 'the brand'
        platform = context.get('platform', 'social media') if context else 'social media'
        
        prompt = f"""Analyze the sentiment of this {platform} mention about {brand_name}:

"{text}"

Provide your analysis in this exact JSON format:
{{
    "sentiment": "positive|negative|neutral",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation of why this sentiment was chosen",
    "emotional_categories": ["excited", "frustrated", "curious", "satisfied", "concerned", "enthusiastic"],
    "intensity": "low|medium|high",
    "context_awareness": "any cultural, sarcastic, or contextual notes"
}}

Consider:
- Sarcasm and irony
- Cultural context and slang
- Brand-specific implications
- Emotional nuance beyond basic positive/negative
- Context of the platform and conversation

Return only the JSON, no additional text."""
        
        # Prepare OpenRouter API request
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://attribution-dashboard.local',
            'X-Title': 'Attribution Dashboard'
        }
        
        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.3,  # Lower temperature for more consistent analysis
            'max_tokens': 500,
            'top_p': 0.9
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
            
            result_data = response.json()
            
            if 'choices' not in result_data or not result_data['choices']:
                raise Exception("No response choices from OpenRouter API")
            
            content = result_data['choices'][0]['message']['content'].strip()
            
            # Parse JSON response
            try:
                # Extract JSON from response if it contains other text
                if '```json' in content:
                    content = content.split('```json')[1].split('```')[0].strip()
                elif '{' in content:
                    start = content.find('{')
                    end = content.rfind('}') + 1
                    content = content[start:end]
                
                result = json.loads(content)
                
                # Validate and normalize result
                return self._normalize_ai_result(result, text)
                
            except (json.JSONDecodeError, KeyError) as e:
                logging.error(f"Failed to parse OpenRouter response: {e}")
                logging.error(f"Raw response: {content}")
                return self._analyze_with_fallback(text)
                
        except requests.exceptions.RequestException as e:
            logging.error(f"OpenRouter API request failed: {e}")
            return self._analyze_with_fallback(text)
    
    def _normalize_ai_result(self, result: Dict[str, Any], original_text: str) -> Dict[str, Any]:
        """Normalize and validate AI analysis result"""
        
        # Ensure required fields
        sentiment = result.get('sentiment', 'neutral').lower()
        if sentiment not in ['positive', 'negative', 'neutral']:
            sentiment = 'neutral'
        
        confidence = float(result.get('confidence', 0.5))
        confidence = max(0.0, min(1.0, confidence))  # Clamp to 0-1
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'reasoning': result.get('reasoning', 'AI-powered sentiment analysis'),
            'emotional_categories': result.get('emotional_categories', []),
            'intensity': result.get('intensity', 'medium'),
            'context_awareness': result.get('context_awareness', ''),
            'method': f'openrouter_{self.model.replace("/", "_")}',
            'text_length': len(original_text),
            'timestamp': time.time()
        }
    
    def _analyze_with_fallback(self, text: str) -> Dict[str, Any]:
        """Fallback to rule-based sentiment analysis"""
        
        text_lower = text.lower()
        
        # Enhanced keyword lists
        positive_words = [
            'love', 'amazing', 'great', 'awesome', 'excellent', 'fantastic', 'wonderful',
            'perfect', 'brilliant', 'outstanding', 'impressive', 'incredible', 'superb',
            'thrilled', 'excited', 'happy', 'satisfied', 'pleased', 'delighted',
            'recommend', 'best', 'favorite', 'thank', 'grateful', 'appreciate'
        ]
        
        negative_words = [
            'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disgusting',
            'annoying', 'frustrated', 'angry', 'disappointed', 'upset', 'furious',
            'broken', 'failed', 'useless', 'worthless', 'disaster', 'nightmare',
            'complaint', 'problem', 'issue', 'bug', 'error', 'crash'
        ]
        
        # Count sentiment words
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        # Determine sentiment
        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = min(0.8, 0.4 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = min(0.8, 0.4 + (negative_count - positive_count) * 0.1)
        else:
            sentiment = 'neutral'
            confidence = 0.3
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'reasoning': f'Rule-based analysis: {positive_count} positive, {negative_count} negative keywords',
            'emotional_categories': [],
            'intensity': 'medium' if confidence > 0.6 else 'low',
            'context_awareness': 'Limited context awareness with rule-based analysis',
            'method': 'rule_based_fallback',
            'text_length': len(text),
            'timestamp': time.time()
        }
    
    def _get_neutral_result(self, reason: str) -> Dict[str, Any]:
        """Return neutral sentiment result with reason"""
        return {
            'sentiment': 'neutral',
            'confidence': 0.0,
            'reasoning': reason,
            'emotional_categories': [],
            'intensity': 'low',
            'context_awareness': '',
            'method': 'default',
            'text_length': 0,
            'timestamp': time.time()
        }
    
    def _get_error_result(self, error: str) -> Dict[str, Any]:
        """Return error result"""
        return {
            'sentiment': 'neutral',
            'confidence': 0.0,
            'reasoning': f'Analysis error: {error}',
            'emotional_categories': [],
            'intensity': 'low',
            'context_awareness': '',
            'method': 'error',
            'text_length': 0,
            'timestamp': time.time()
        }
    
    def analyze_batch(self, texts: List[str], context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Analyze multiple texts for sentiment"""
        results = []
        for text in texts:
            result = self.analyze_sentiment(text, context)
            results.append(result)
            # Add small delay to respect API limits
            if self.initialized:
                time.sleep(0.2)  # Slightly longer delay for OpenRouter
        return results
    
    def get_sentiment_summary(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate summary statistics from multiple sentiment analyses"""
        if not results:
            return {'total': 0, 'positive': 0, 'negative': 0, 'neutral': 0, 'avg_confidence': 0.0}
        
        total = len(results)
        positive = sum(1 for r in results if r['sentiment'] == 'positive')
        negative = sum(1 for r in results if r['sentiment'] == 'negative')
        neutral = sum(1 for r in results if r['sentiment'] == 'neutral')
        avg_confidence = sum(r['confidence'] for r in results) / total
        
        # Collect emotional categories
        all_emotions = []
        for r in results:
            all_emotions.extend(r.get('emotional_categories', []))
        
        emotion_counts = {}
        for emotion in all_emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        return {
            'total': total,
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'positive_percent': (positive / total) * 100,
            'negative_percent': (negative / total) * 100,
            'neutral_percent': (neutral / total) * 100,
            'avg_confidence': round(avg_confidence, 3),
            'emotion_distribution': emotion_counts,
            'high_confidence_count': sum(1 for r in results if r['confidence'] > 0.7)
        }
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get list of available models from OpenRouter"""
        if not self.initialized:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                models_data = response.json()
                return [
                    {
                        'id': model['id'],
                        'name': model.get('name', model['id']),
                        'description': model.get('description', ''),
                        'pricing': model.get('pricing', {})
                    }
                    for model in models_data.get('data', [])
                    if 'gpt' in model['id'].lower() or 'gemini' in model['id'].lower() or 'claude' in model['id'].lower()
                ]
            else:
                logging.error(f"Failed to fetch models: {response.status_code}")
                return []
                
        except Exception as e:
            logging.error(f"Error fetching available models: {e}")
            return []


# Global instance for use in other modules
openrouter_sentiment = OpenRouterSentimentAnalyzer()


def analyze_sentiment_enhanced(text: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Enhanced sentiment analysis function for backward compatibility
    
    Args:
        text: Text to analyze
        context: Optional context dict with platform, brand, etc.
        
    Returns:
        Enhanced sentiment analysis result
    """
    return openrouter_sentiment.analyze_sentiment(text, context)


def get_sentiment_only(text: str) -> str:
    """
    Simple function that returns only sentiment classification for backward compatibility
    
    Args:
        text: Text to analyze
        
    Returns:
        Sentiment classification: 'positive', 'negative', or 'neutral'
    """
    result = openrouter_sentiment.analyze_sentiment(text)
    return result['sentiment']


def set_model(model: str) -> bool:
    """
    Set the AI model to use for sentiment analysis
    
    Args:
        model: Model identifier (e.g., 'google/gemini-2.0-flash-exp', 'openai/gpt-4')
        
    Returns:
        True if model was set successfully
    """
    global openrouter_sentiment
    try:
        openrouter_sentiment.model = model
        logging.info(f"OpenRouter model set to: {model}")
        return True
    except Exception as e:
        logging.error(f"Failed to set model: {e}")
        return False


def get_current_model() -> str:
    """Get the currently configured model"""
    return openrouter_sentiment.model if openrouter_sentiment else 'rule_based_fallback'