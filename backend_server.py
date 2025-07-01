#!/usr/bin/env python3
"""
Attribution Dashboard Backend Server
Serves the frontend and provides real API data integration
"""

from flask import Flask, jsonify, request, send_from_directory, send_file, session
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import logging
from dotenv import load_dotenv
from typing import Dict, List, Any

# Import our existing integrations
from scrape_creators_integration import ScrapeCreatorsIntegration
from exa_search_integration import ExaSearchIntegration

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import GA4 integration
try:
    from google_analytics_integration import GoogleAnalyticsIntegration
    GA4_AVAILABLE = True
except ImportError:
    GA4_AVAILABLE = False
    logger.warning("GA4 integration not available. Install with: pip install google-analytics-data google-auth google-auth-oauthlib")

# Import enhanced sentiment analysis
try:
    from openrouter_sentiment_integration import OpenRouterSentimentAnalyzer, analyze_sentiment_enhanced
    OPENROUTER_SENTIMENT_AVAILABLE = True
except ImportError:
    OPENROUTER_SENTIMENT_AVAILABLE = False
    logger.warning("OpenRouter sentiment analysis not available. Using fallback sentiment analysis.")

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure session
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')

# Configuration
BRAND_NAME = os.getenv('BRAND_NAME', 'YourBrand')
SCRAPE_CREATORS_API_KEY = os.getenv('SCRAPE_CREATORS_API_KEY', '')
EXA_API_KEY = os.getenv('EXA_API_KEY', '')

# Google APIs Configuration
GOOGLE_SEARCH_CONSOLE_API_KEY = os.getenv('GOOGLE_SEARCH_CONSOLE_API_KEY', '')
GOOGLE_ANALYTICS_API_KEY = os.getenv('GOOGLE_ANALYTICS_API_KEY', '')

# GA4 Configuration
GA4_PROPERTY_ID = os.getenv('GA4_PROPERTY_ID', '')
GA4_CREDENTIALS_PATH = os.getenv('GA4_CREDENTIALS_PATH', '')
GA4_CREDENTIALS_JSON = os.getenv('GA4_CREDENTIALS_JSON', '')

# OpenRouter AI Configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
OPENROUTER_MODEL = os.getenv('OPENROUTER_MODEL', 'google/gemini-2.0-flash-exp')

# Cache configuration
CACHE_DIR = 'data_cache'
MENTIONS_CACHE_FILE = os.path.join(CACHE_DIR, 'mentions_cache.json')

# Ensure cache directory exists
os.makedirs(CACHE_DIR, exist_ok=True)

def get_brand_name():
    """Get brand name from session or environment"""
    return session.get('brand_name', BRAND_NAME)

# Initialize integrations
scrape_creators = None
exa_search = None
ga4_analytics = None
openrouter_sentiment = None

if SCRAPE_CREATORS_API_KEY:
    try:
        scrape_creators = ScrapeCreatorsIntegration(SCRAPE_CREATORS_API_KEY, BRAND_NAME)
        logger.info("ScrapeCreators integration initialized")
    except Exception as e:
        logger.error(f"Failed to initialize ScrapeCreators: {e}")

if EXA_API_KEY:
    try:
        exa_search = ExaSearchIntegration(EXA_API_KEY, BRAND_NAME)
        logger.info("Exa Search integration initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Exa Search: {e}")

if GA4_AVAILABLE and (GA4_PROPERTY_ID or GA4_CREDENTIALS_PATH or GA4_CREDENTIALS_JSON):
    try:
        ga4_analytics = GoogleAnalyticsIntegration(
            property_id=GA4_PROPERTY_ID,
            credentials_path=GA4_CREDENTIALS_PATH,
            credentials_json=GA4_CREDENTIALS_JSON
        )
        logger.info("GA4 Analytics integration initialized")
    except Exception as e:
        logger.error(f"Failed to initialize GA4: {e}")

# Initialize OpenRouter sentiment analysis
if OPENROUTER_SENTIMENT_AVAILABLE and OPENROUTER_API_KEY:
    try:
        openrouter_sentiment = OpenRouterSentimentAnalyzer(OPENROUTER_API_KEY, OPENROUTER_MODEL)
        logger.info(f"OpenRouter sentiment analysis initialized with model: {OPENROUTER_MODEL}")
    except Exception as e:
        logger.error(f"Failed to initialize OpenRouter sentiment: {e}")
else:
    logger.info("Using fallback rule-based sentiment analysis")

# Serve static files (frontend)
@app.route('/')
def serve_index():
    return send_file('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Session API Key Management
@app.route('/api/store-api-key', methods=['POST'])
def store_api_key():
    """Store API key in session for temporary use"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
            
        service = data.get('service')
        api_key = data.get('api_key')
        
        if not service or not api_key:
            return jsonify({
                'status': 'error',
                'message': 'Service and API key are required'
            }), 400
        
        # Store in session
        if 'api_keys' not in session:
            session['api_keys'] = {}
        
        session['api_keys'][service] = api_key
        session.permanent = True
        
        return jsonify({
            'status': 'success',
            'message': f'{service} API key stored for this session'
        })
        
    except Exception as e:
        logger.error(f"Error storing API key: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to store API key: {str(e)}'
        }), 500

@app.route('/api/get-stored-keys', methods=['GET'])
def get_stored_keys():
    """Get list of stored API keys (without revealing the keys)"""
    try:
        stored_keys = session.get('api_keys', {})
        return jsonify({
            'status': 'success',
            'stored_services': list(stored_keys.keys()),
            'session_id': session.get('session_id', 'none'),
            'brand_name': get_brand_name(),
            'env_keys': {
                'scrape_creators': bool(SCRAPE_CREATORS_API_KEY),
                'exa_search': bool(EXA_API_KEY)
            }
        })
    except Exception as e:
        logger.error(f"Error getting stored keys: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to get stored keys: {str(e)}'
        }), 500

# API Endpoints
@app.route('/api/test-connection', methods=['POST'])
def test_api_connection():
    """Test API connection for various services"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
            
        service = data.get('service')
        api_key = data.get('api_key')
        
        if not service:
            return jsonify({
                'status': 'error',
                'message': 'Service parameter is required'
            }), 400
        
        # Try to get API key from session if not provided
        if not api_key:
            session_keys = session.get('api_keys', {})
            api_key = session_keys.get(service)
            
        if not api_key:
            return jsonify({
                'status': 'error',
                'message': 'API key is required'
            }), 400
        
        if service == 'scrape_creators':
            try:
                brand_name = get_brand_name()
                test_integration = ScrapeCreatorsIntegration(api_key, brand_name)
                # Test with a simple search
                result = test_integration.search_tiktok(brand_name, trim=True)
                
                # Store successful key in session
                if 'api_keys' not in session:
                    session['api_keys'] = {}
                session['api_keys'][service] = api_key
                
                return jsonify({
                    'status': 'success',
                    'message': 'ScrapeCreators API connected successfully',
                    'data': {'results_count': len(result.get('search_item_list', []))}
                })
            except Exception as e:
                logger.error(f"ScrapeCreators API test failed: {e}")
                return jsonify({
                    'status': 'error',
                    'message': f'ScrapeCreators API connection failed: {str(e)}'
                }), 400
        
        elif service == 'exa_search':
            try:
                brand_name = get_brand_name()
                test_integration = ExaSearchIntegration(api_key, brand_name)
                # Test with a simple search
                result = test_integration._execute_search(brand_name, 
                                                        datetime.now() - timedelta(days=1),
                                                        datetime.now(), 
                                                        5)
                
                # Store successful key in session
                if 'api_keys' not in session:
                    session['api_keys'] = {}
                session['api_keys'][service] = api_key
                
                return jsonify({
                    'status': 'success',
                    'message': 'Exa Search API connected successfully',
                    'data': {'results_count': len(result)}
                })
            except Exception as e:
                logger.error(f"Exa Search API test failed: {e}")
                return jsonify({
                    'status': 'error',
                    'message': f'Exa Search API connection failed: {str(e)}'
                }), 400
        
        elif service == 'ga4_analytics':
            try:
                if not GA4_AVAILABLE:
                    return jsonify({
                        'status': 'error',
                        'message': 'GA4 integration not available. Install with: pip install google-analytics-data google-auth'
                    }), 400
                
                # For GA4, we need property_id and credentials
                data = request.get_json()
                property_id = data.get('property_id')
                credentials_path = data.get('credentials_path')
                credentials_json = data.get('credentials_json')
                
                if not property_id:
                    return jsonify({
                        'status': 'error',
                        'message': 'GA4 Property ID is required'
                    }), 400
                
                if not credentials_path and not credentials_json:
                    return jsonify({
                        'status': 'error',
                        'message': 'GA4 credentials (file path or JSON) are required'
                    }), 400
                
                test_integration = GoogleAnalyticsIntegration(
                    property_id=property_id,
                    credentials_path=credentials_path,
                    credentials_json=credentials_json
                )
                
                # Test connection
                test_result = test_integration.test_connection()
                
                if test_result['status'] == 'success':
                    # Store successful configuration in session
                    if 'api_keys' not in session:
                        session['api_keys'] = {}
                    session['api_keys'][service] = {
                        'property_id': property_id,
                        'credentials_path': credentials_path,
                        'credentials_json': credentials_json
                    }
                    
                    return jsonify({
                        'status': 'success',
                        'message': 'GA4 Analytics connected successfully',
                        'data': {
                            'property_id': test_result['property_id'],
                            'yesterday_sessions': test_result['yesterday_sessions']
                        }
                    })
                else:
                    return jsonify({
                        'status': 'error',
                        'message': f'GA4 connection failed: {test_result["error"]}'
                    }), 400
                    
            except Exception as e:
                logger.error(f"GA4 API test failed: {e}")
                return jsonify({
                    'status': 'error',
                    'message': f'GA4 API connection failed: {str(e)}'
                }), 400
        
        else:
            return jsonify({
                'status': 'error',
                'message': f'Unknown service: {service}'
            }), 400
            
    except Exception as e:
        logger.error(f"Error in test_api_connection: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Connection test failed: {str(e)}'
        }), 500

def load_cached_mentions(max_age_hours=24):
    """Load mentions from cache if file exists and is recent enough"""
    try:
        if not os.path.exists(MENTIONS_CACHE_FILE):
            return None
            
        # Check file age
        file_age = datetime.now() - datetime.fromtimestamp(os.path.getmtime(MENTIONS_CACHE_FILE))
        if file_age.total_seconds() > max_age_hours * 3600:
            logger.info(f"Cache file is {file_age} old, too old to use")
            return None
            
        with open(MENTIONS_CACHE_FILE, 'r', encoding='utf-8') as f:
            cached_data = json.load(f)
            
        logger.info(f"Loaded {len(cached_data.get('mentions', []))} mentions from cache")
        return cached_data
        
    except Exception as e:
        logger.error(f"Error loading cached mentions: {e}")
        return None

def save_mentions_to_cache(mentions_data):
    """Save mentions data to cache file"""
    try:
        cache_data = {
            'timestamp': datetime.now().isoformat(),
            'brand_name': get_brand_name(),
            'total_count': len(mentions_data),
            'mentions': mentions_data
        }
        
        with open(MENTIONS_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, indent=2, default=str)
            
        logger.info(f"Saved {len(mentions_data)} mentions to cache")
        return True
        
    except Exception as e:
        logger.error(f"Error saving mentions to cache: {e}")
        return False

@app.route('/api/fetch-mentions', methods=['GET'])
def fetch_mentions():
    """Fetch brand mentions - from cache first, then live if needed"""
    days_back = int(request.args.get('days_back', 7))
    platform = request.args.get('platform', 'all')
    force_refresh = request.args.get('force_refresh', 'false').lower() == 'true'
    
    try:
        # Try to load from cache first (unless force refresh is requested)
        if not force_refresh:
            cached_data = load_cached_mentions(max_age_hours=24)
            if cached_data:
                mentions = cached_data['mentions']
                
                # Filter by platform if specified
                if platform != 'all':
                    mentions = [m for m in mentions if m.get('platform') == platform]
                
                # Filter by timeframe
                cutoff_date = datetime.now() - timedelta(days=days_back)
                filtered_mentions = []
                for mention in mentions:
                    try:
                        mention_date = datetime.fromisoformat(mention.get('timestamp', '').replace('Z', '+00:00'))
                        if mention_date >= cutoff_date:
                            filtered_mentions.append(mention)
                    except:
                        # Include mentions with invalid timestamps
                        filtered_mentions.append(mention)
                
                return jsonify({
                    'status': 'success',
                    'data': filtered_mentions,
                    'total_count': len(filtered_mentions),
                    'source': 'cache',
                    'cache_timestamp': cached_data['timestamp'],
                    'platforms_searched': [platform] if platform != 'all' else ['tiktok', 'youtube', 'reddit', 'web']
                })
        
        # If no cache or force refresh, return empty data and suggest using refresh endpoint
        return jsonify({
            'status': 'success',
            'data': [],
            'total_count': 0,
            'source': 'empty',
            'message': 'No cached data available. Use /api/refresh-mentions to fetch new data.',
            'platforms_searched': [platform] if platform != 'all' else ['tiktok', 'youtube', 'reddit', 'web']
        })
        
    except Exception as e:
        logger.error(f"Error fetching mentions: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to fetch mentions: {str(e)}'
        }), 500

@app.route('/api/refresh-mentions', methods=['POST'])
def refresh_mentions():
    """Fetch fresh mentions from APIs and save to cache"""
    days_back = int(request.json.get('days_back', 7)) if request.json else 7
    platform = request.json.get('platform', 'all') if request.json else 'all'
    
    all_mentions = []
    
    try:
        # Get API keys from session
        session_keys = session.get('api_keys', {})
        
        # Fetch from ScrapeCreators
        sc_key = session_keys.get('scrape_creators') or SCRAPE_CREATORS_API_KEY
        if sc_key and (platform == 'all' or platform in ['tiktok', 'youtube', 'reddit']):
            try:
                brand_name = get_brand_name()
                sc_integration = ScrapeCreatorsIntegration(sc_key, brand_name)
                platforms = ['tiktok', 'youtube', 'reddit'] if platform == 'all' else [platform]
                sc_mentions = sc_integration.fetch_mentions(platforms, days_back)
                # Normalize ScrapeCreators data format
                for mention in sc_mentions:
                    # Ensure timestamp field exists (ScrapeCreators uses 'created_at')
                    if 'created_at' in mention and 'timestamp' not in mention:
                        mention['timestamp'] = mention['created_at']
                    # Ensure title field exists for frontend
                    if 'title' not in mention:
                        mention['title'] = mention.get('content', '')[:100] + '...' if len(mention.get('content', '')) > 100 else mention.get('content', '')
                    # Add source field if missing
                    if 'source' not in mention:
                        mention['source'] = mention.get('platform', 'unknown')
                
                all_mentions.extend(sc_mentions)
                logger.info(f"Fetched {len(sc_mentions)} mentions from ScrapeCreators")
            except Exception as e:
                logger.error(f"Error fetching from ScrapeCreators: {e}")
        
        # Fetch from Exa Search
        exa_key = session_keys.get('exa_search') or EXA_API_KEY
        if exa_key and (platform == 'all' or platform == 'web'):
            try:
                brand_name = get_brand_name()
                exa_integration = ExaSearchIntegration(exa_key, brand_name)
                exa_mentions = exa_integration.search_mentions(days_back, 50)
                # Convert to standard format
                for mention in exa_mentions:
                    all_mentions.append({
                        'id': mention.get('id'),
                        'timestamp': mention.get('published_date'),
                        'platform': 'web',
                        'source': mention.get('domain'),
                        'content': mention.get('content', '')[:200] + '...',
                        'title': mention.get('title'),
                        'url': mention.get('url'),
                        'author': mention.get('author'),
                        'sentiment': mention.get('sentiment'),
                        'relevance_score': mention.get('relevance_score')
                    })
                logger.info(f"Fetched {len(exa_mentions)} mentions from Exa Search")
            except Exception as e:
                logger.error(f"Error fetching from Exa Search: {e}")
        
        # Sort by timestamp (most recent first)
        all_mentions.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        # Save to cache
        save_mentions_to_cache(all_mentions)
        
        return jsonify({
            'status': 'success',
            'data': all_mentions,
            'total_count': len(all_mentions),
            'source': 'live_api',
            'cached': True,
            'platforms_searched': [platform] if platform != 'all' else ['tiktok', 'youtube', 'reddit', 'web']
        })
        
    except Exception as e:
        logger.error(f"Error refreshing mentions: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to refresh mentions: {str(e)}'
        }), 500

@app.route('/api/cache-status', methods=['GET'])
def get_cache_status():
    """Get information about the current cache"""
    try:
        if not os.path.exists(MENTIONS_CACHE_FILE):
            return jsonify({
                'status': 'success',
                'cached': False,
                'message': 'No cache file exists'
            })
        
        # Get file stats
        file_stats = os.stat(MENTIONS_CACHE_FILE)
        file_age = datetime.now() - datetime.fromtimestamp(file_stats.st_mtime)
        
        # Load cache data for more info
        try:
            with open(MENTIONS_CACHE_FILE, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            return jsonify({
                'status': 'success',
                'cached': True,
                'cache_timestamp': cache_data.get('timestamp'),
                'total_mentions': cache_data.get('total_count', 0),
                'brand_name': cache_data.get('brand_name'),
                'file_age_hours': round(file_age.total_seconds() / 3600, 1),
                'file_size_kb': round(file_stats.st_size / 1024, 1),
                'is_stale': file_age.total_seconds() > 24 * 3600  # 24 hours
            })
            
        except Exception as e:
            return jsonify({
                'status': 'success',
                'cached': True,
                'error': f'Cache file exists but could not be read: {e}',
                'file_age_hours': round(file_age.total_seconds() / 3600, 1),
                'file_size_kb': round(file_stats.st_size / 1024, 1)
            })
            
    except Exception as e:
        logger.error(f"Error checking cache status: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to check cache status: {str(e)}'
        }), 500

@app.route('/api/dashboard-metrics', methods=['GET'])
def get_dashboard_metrics():
    """Get aggregated metrics for dashboard signals"""
    days_back = int(request.args.get('days_back', 7))
    
    try:
        metrics = {
            'branded_search_volume': 0,
            'direct_traffic': 0,
            'inbound_messages': 0,
            'community_engagement': 0,
            'first_party_data': 0,
            'attribution_score': 0.0
        }
        
        # Fetch recent mentions to calculate metrics
        all_mentions = []
        
        # Get API keys from session
        session_keys = session.get('api_keys', {})
        
        # Try to use cached data first
        cached_data = load_cached_mentions(max_age_hours=24)
        if cached_data:
            all_mentions = cached_data['mentions']
            # Filter by timeframe
            cutoff_date = datetime.now() - timedelta(days=days_back)
            filtered_mentions = []
            for mention in all_mentions:
                try:
                    mention_date = datetime.fromisoformat(mention.get('timestamp', '').replace('Z', '+00:00'))
                    if mention_date >= cutoff_date:
                        filtered_mentions.append(mention)
                except:
                    filtered_mentions.append(mention)
            all_mentions = filtered_mentions
            logger.info(f"Using {len(all_mentions)} cached mentions for metrics")
        else:
            logger.info("No cached data available for metrics, using estimated values")
        
        # Calculate metrics based on mentions
        total_mentions = len(all_mentions)
        
        # Community engagement (social platforms)
        community_mentions = [m for m in all_mentions if m.get('platform') in ['tiktok', 'youtube', 'reddit', 'discord']]
        metrics['community_engagement'] = len(community_mentions)
        
        # Inbound messages (web mentions that look like inquiries)
        web_mentions = [m for m in all_mentions if m.get('platform') == 'web']
        inquiry_keywords = ['contact', 'inquiry', 'question', 'demo', 'trial', 'pricing']
        inbound_mentions = []
        for mention in web_mentions:
            content = mention.get('content', '').lower()
            if any(keyword in content for keyword in inquiry_keywords):
                inbound_mentions.append(mention)
        metrics['inbound_messages'] = len(inbound_mentions)
        
        # Get real GA4 data if available
        using_real_ga4_data = False
        session_ga4 = session.get('api_keys', {}).get('ga4_analytics')
        
        if ga4_analytics or session_ga4:
            try:
                # Use global GA4 integration or create from session data
                if ga4_analytics:
                    ga4_integration = ga4_analytics
                elif session_ga4:
                    ga4_integration = GoogleAnalyticsIntegration(
                        property_id=session_ga4['property_id'],
                        credentials_path=session_ga4.get('credentials_path'),
                        credentials_json=session_ga4.get('credentials_json')
                    )
                else:
                    ga4_integration = None
                
                if ga4_integration:
                    # Get real direct traffic data
                    direct_data = ga4_integration.get_direct_traffic_data(days_back)
                    metrics['direct_traffic'] = direct_data['total_sessions']
                    
                    # Get branded search estimate
                    branded_data = ga4_integration.get_branded_search_data([get_brand_name()], days_back)
                    metrics['branded_search_volume'] = branded_data['estimated_branded_sessions']
                    
                    using_real_ga4_data = True
                    logger.info(f"Using real GA4 data: {metrics['direct_traffic']} direct sessions, {metrics['branded_search_volume']} branded search")
                    
            except Exception as e:
                logger.error(f"Error fetching GA4 data, falling back to estimates: {e}")
                # Fall back to estimates
                metrics['branded_search_volume'] = total_mentions * 15
                metrics['direct_traffic'] = total_mentions * 8
        else:
            # Branded search volume (estimated from mention frequency)
            metrics['branded_search_volume'] = total_mentions * 15  # Rough multiplier
            
            # Direct traffic (estimated)
            metrics['direct_traffic'] = total_mentions * 8
        
        # First party data (estimated from high-intent mentions)
        high_intent_keywords = ['signup', 'register', 'trial', 'demo', 'pricing', 'buy']
        first_party_mentions = []
        for mention in all_mentions:
            content = mention.get('content', '').lower()
            if any(keyword in content for keyword in high_intent_keywords):
                first_party_mentions.append(mention)
        metrics['first_party_data'] = len(first_party_mentions)
        
        # Attribution score (based on overall activity and sentiment)
        positive_mentions = [m for m in all_mentions if m.get('sentiment') == 'positive']
        if total_mentions > 0:
            positive_ratio = len(positive_mentions) / total_mentions
            activity_score = min(total_mentions / 10, 1.0)  # Normalize to 0-1
            metrics['attribution_score'] = round((positive_ratio * 0.6 + activity_score * 0.4) * 10, 1)
        
        # Add data source flags to metrics
        metrics['data_source'] = 'ga4' if using_real_ga4_data else 'estimated'
        metrics['total_mentions'] = total_mentions
        
        return jsonify({
            'status': 'success',
            'data': metrics,
            'metadata': {
                'total_mentions': total_mentions,
                'positive_mentions': len(positive_mentions),
                'days_analyzed': days_back,
                'last_updated': datetime.now().isoformat(),
                'using_real_ga4_data': using_real_ga4_data,
                'data_sources': {
                    'direct_traffic': 'GA4' if using_real_ga4_data else 'Estimated from social mentions',
                    'branded_search': 'GA4' if using_real_ga4_data else 'Estimated from social mentions',
                    'community_engagement': 'Social Media APIs (ScrapeCreators)',
                    'inbound_messages': 'Web mentions analysis',
                    'first_party_data': 'High-intent keywords analysis'
                },
                'debug_info': {
                    'session_keys': list(session.get('api_keys', {}).keys()),
                    'env_keys': {
                        'scrape_creators': bool(SCRAPE_CREATORS_API_KEY),
                        'exa_search': bool(EXA_API_KEY),
                        'ga4_analytics': bool(ga4_analytics)
                    },
                    'brand_name': get_brand_name(),
                    'mentions_breakdown': {
                        'scrape_creators': len([m for m in all_mentions if m.get('platform') in ['tiktok', 'youtube', 'reddit']]),
                        'exa_search': len([m for m in all_mentions if m.get('platform') == 'web'])
                    }
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Error calculating metrics: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to calculate metrics: {str(e)}'
        }), 500

@app.route('/api/brand-config', methods=['GET', 'POST'])
def brand_config():
    """Get or update brand configuration"""
    if request.method == 'GET':
        return jsonify({
            'brand_name': get_brand_name(),
            'configured_apis': {
                'scrape_creators': bool(session.get('api_keys', {}).get('scrape_creators') or SCRAPE_CREATORS_API_KEY),
                'exa_search': bool(session.get('api_keys', {}).get('exa_search') or EXA_API_KEY)
            }
        })
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    'status': 'error',
                    'message': 'No data provided'
                }), 400
            
            # Update brand name in session
            brand_name = data.get('brand_name')
            if brand_name:
                session['brand_name'] = brand_name
                session.permanent = True
            
            return jsonify({
                'status': 'success',
                'message': 'Brand configuration updated'
            })
        except Exception as e:
            logger.error(f"Error updating brand config: {e}")
            return jsonify({
                'status': 'error',
                'message': f'Failed to update configuration: {str(e)}'
            }), 500

@app.route('/api/sentiment-analysis', methods=['POST'])
def sentiment_analysis_api():
    """Analyze sentiment of provided text"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        text = data.get('text', '').strip()
        if not text:
            return jsonify({
                'status': 'error',
                'message': 'No text provided for analysis'
            }), 400
        
        platform = data.get('platform', 'web')
        
        # Use OpenRouter sentiment analysis if available
        if openrouter_sentiment:
            try:
                context = {
                    'brand': get_brand_name(),
                    'platform': platform
                }
                result = openrouter_sentiment.analyze_sentiment(text, context)
                return jsonify({
                    'status': 'success',
                    'data': result
                })
            except Exception as e:
                logger.error(f"OpenRouter sentiment analysis failed: {e}")
                return jsonify({
                    'status': 'error', 
                    'message': f'Sentiment analysis failed: {str(e)}'
                }), 500
        else:
            # Use fallback analysis
            return jsonify({
                'status': 'success',
                'data': {
                    'sentiment': 'neutral',
                    'confidence': 0.3,
                    'reasoning': 'OpenRouter sentiment analysis not available, using basic fallback',
                    'method': 'fallback',
                    'emotional_categories': [],
                    'intensity': 'low',
                    'context_awareness': 'Limited - API key not configured'
                }
            })
    
    except Exception as e:
        logger.error(f"Sentiment analysis API error: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Sentiment analysis failed: {str(e)}'
        }), 500

@app.route('/api/sentiment-config', methods=['GET'])
def sentiment_config():
    """Get sentiment analysis configuration status"""
    return jsonify({
        'openrouter_available': OPENROUTER_SENTIMENT_AVAILABLE,
        'openrouter_configured': bool(openrouter_sentiment),
        'openrouter_api_key_set': bool(OPENROUTER_API_KEY),
        'current_model': OPENROUTER_MODEL,
        'status': 'enhanced' if openrouter_sentiment else 'fallback'
    })

if __name__ == '__main__':
    print("🚀 Attribution Dashboard Backend Server")
    print(f"Brand: {BRAND_NAME}")
    print(f"ScrapeCreators API: {'✓ Connected' if SCRAPE_CREATORS_API_KEY else '✗ Not configured'}")
    print(f"Exa Search API: {'✓ Connected' if EXA_API_KEY else '✗ Not configured'}")
    print(f"GA4 Analytics: {'✓ Connected' if ga4_analytics else '✗ Not configured'}")
    print(f"AI Sentiment: {'✓ Enhanced (' + OPENROUTER_MODEL + ')' if openrouter_sentiment else '✗ Basic Rule-based'}")
    print("\nStarting server on http://localhost:8080")
    print("Frontend will be available at http://localhost:8080")
    
    if not ga4_analytics:
        print("\n💡 To enable GA4 integration:")
        print("   1. Set GA4_PROPERTY_ID in your .env file")
        print("   2. Set GA4_CREDENTIALS_PATH or GA4_CREDENTIALS_JSON")
        print("   3. Install dependencies: pip install google-analytics-data google-auth")
    
    if not openrouter_sentiment:
        print("\n🤖 To enable AI-powered sentiment analysis:")
        print("   1. Set OPENROUTER_API_KEY in your .env file")
        print("   2. Get free API key at: https://openrouter.ai/keys")
        print("   3. Optionally set OPENROUTER_MODEL to choose your AI model")
        print("   4. Available models: Gemini, GPT-4, Claude, and more")
    
    app.run(host='0.0.0.0', port=8080, debug=True) 