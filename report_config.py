#!/usr/bin/env python3
"""
Report Configuration System
Defines report templates, query configurations, and validation
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class ScheduleType(Enum):
    """Supported schedule types"""
    INTERVAL = "interval"
    CRON = "cron"

class IntervalType(Enum):
    """Supported interval types for interval scheduling"""
    MINUTES = "minutes"
    HOURS = "hours"
    DAYS = "days"
    WEEKS = "weeks"

class OutputFormat(Enum):
    """Supported output formats"""
    CSV = "csv"
    JSON = "json"
    HTML = "html"
    PDF = "pdf"

class DeliveryMethod(Enum):
    """Supported delivery methods"""
    FILE = "file"
    EMAIL = "email"
    WEBHOOK = "webhook"

class DataSource(Enum):
    """Available data sources"""
    SCRAPE_CREATORS = "scrape_creators"
    EXA_SEARCH = "exa_search"
    GA4_ANALYTICS = "ga4_analytics"
    LIVE_FEED = "live_feed"
    DASHBOARD_SIGNALS = "dashboard_signals"

class ReportTemplate:
    """Report template definitions"""
    
    MENTIONS_SUMMARY = {
        'name': 'Mentions Summary Report',
        'description': 'Summary of brand mentions across all platforms',
        'data_sources': [DataSource.SCRAPE_CREATORS.value, DataSource.EXA_SEARCH.value],
        'default_query': {
            'date_range': 7,
            'platforms': ['all'],
            'include_sentiment': True,
            'min_engagement': 0,
            'keywords': []
        },
        'output_columns': [
            'timestamp', 'platform', 'content', 'sentiment', 'engagement', 
            'author', 'url', 'relevance_score'
        ],
        'summary_metrics': [
            'total_mentions', 'sentiment_breakdown', 'platform_breakdown',
            'top_keywords', 'engagement_stats'
        ]
    }
    
    TRAFFIC_ANALYSIS = {
        'name': 'Traffic Analysis Report',
        'description': 'Analysis of direct traffic and branded search volume',
        'data_sources': [DataSource.GA4_ANALYTICS.value, DataSource.DASHBOARD_SIGNALS.value],
        'default_query': {
            'date_range': 30,
            'metrics': ['direct_traffic', 'branded_search_volume', 'organic_traffic'],
            'include_comparisons': True,
            'breakdown_by': 'day'
        },
        'output_columns': [
            'date', 'direct_sessions', 'branded_search_sessions', 'organic_sessions',
            'total_sessions', 'bounce_rate', 'avg_session_duration'
        ],
        'summary_metrics': [
            'total_sessions', 'traffic_growth', 'channel_breakdown', 'trends'
        ]
    }
    
    ATTRIBUTION_DIGEST = {
        'name': 'Attribution Digest',
        'description': 'Comprehensive attribution tracking digest',
        'data_sources': [
            DataSource.DASHBOARD_SIGNALS.value, DataSource.SCRAPE_CREATORS.value,
            DataSource.EXA_SEARCH.value, DataSource.GA4_ANALYTICS.value
        ],
        'default_query': {
            'date_range': 7,
            'include_signals': True,
            'include_mentions': True,
            'include_traffic': True,
            'summary_level': 'detailed'
        },
        'output_columns': [
            'metric_type', 'current_value', 'previous_value', 'change_percent',
            'trend', 'top_contributors'
        ],
        'summary_metrics': [
            'attribution_score', 'signal_changes', 'top_performing_channels',
            'key_insights', 'action_items'
        ]
    }
    
    CAMPAIGN_PERFORMANCE = {
        'name': 'Campaign Performance Report',
        'description': 'Performance analysis of marketing campaigns',
        'data_sources': [DataSource.DASHBOARD_SIGNALS.value, DataSource.LIVE_FEED.value],
        'default_query': {
            'date_range': 30,
            'campaigns': ['all'],
            'include_mentions': True,
            'include_signals': True,
            'comparison_period': True
        },
        'output_columns': [
            'campaign_name', 'mentions_delta', 'branded_search_delta', 
            'direct_traffic_delta', 'attribution_impact', 'roi_estimate'
        ],
        'summary_metrics': [
            'top_performing_campaigns', 'campaign_attribution', 'budget_efficiency',
            'optimization_recommendations'
        ]
    }
    
    SENTIMENT_ANALYSIS = {
        'name': 'Sentiment Analysis Report',
        'description': 'Detailed sentiment analysis of brand mentions',
        'data_sources': [DataSource.SCRAPE_CREATORS.value, DataSource.EXA_SEARCH.value],
        'default_query': {
            'date_range': 14,
            'platforms': ['all'],
            'sentiment_threshold': 0.5,
            'include_ai_analysis': True,
            'keywords': []
        },
        'output_columns': [
            'timestamp', 'platform', 'content', 'sentiment_score', 'sentiment_label',
            'emotional_categories', 'context_analysis', 'recommendation'
        ],
        'summary_metrics': [
            'sentiment_distribution', 'sentiment_trends', 'platform_sentiment',
            'key_issues', 'improvement_opportunities'
        ]
    }

class QueryBuilder:
    """Build and validate queries for different data sources"""
    
    @staticmethod
    def build_scrape_creators_query(config: Dict[str, Any]) -> Dict[str, Any]:
        """Build query for ScrapeCreators API"""
        query = {
            'platforms': config.get('platforms', ['tiktok', 'youtube', 'reddit']),
            'days_back': config.get('date_range', 7),
            'brand_name': config.get('brand_name', ''),
            'keywords': config.get('keywords', []),
            'min_engagement': config.get('min_engagement', 0),
            'include_sentiment': config.get('include_sentiment', True)
        }
        
        # Filter out empty platforms
        if 'all' in query['platforms']:
            query['platforms'] = ['tiktok', 'youtube', 'reddit']
        
        return query
    
    @staticmethod
    def build_exa_search_query(config: Dict[str, Any]) -> Dict[str, Any]:
        """Build query for Exa Search API"""
        query = {
            'brand_name': config.get('brand_name', ''),
            'days_back': config.get('date_range', 7),
            'num_results': config.get('max_results', 100),
            'keywords': config.get('keywords', []),
            'domains': config.get('domains', []),
            'exclude_domains': config.get('exclude_domains', []),
            'include_sentiment': config.get('include_sentiment', True)
        }
        
        return query
    
    @staticmethod
    def build_ga4_query(config: Dict[str, Any]) -> Dict[str, Any]:
        """Build query for GA4 Analytics"""
        query = {
            'date_range': config.get('date_range', 30),
            'metrics': config.get('metrics', ['sessions', 'users', 'pageviews']),
            'dimensions': config.get('dimensions', ['date']),
            'filters': config.get('filters', []),
            'breakdown_by': config.get('breakdown_by', 'day'),
            'include_comparisons': config.get('include_comparisons', True)
        }
        
        return query
    
    @staticmethod
    def build_dashboard_signals_query(config: Dict[str, Any]) -> Dict[str, Any]:
        """Build query for dashboard signals"""
        query = {
            'date_range': config.get('date_range', 7),
            'signals': config.get('signals', ['all']),
            'include_campaigns': config.get('include_campaigns', True),
            'include_echoes': config.get('include_echoes', True),
            'aggregation': config.get('aggregation', 'daily')
        }
        
        return query

class ReportConfigValidator:
    """Validate report configurations"""
    
    @staticmethod
    def validate_report_config(config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a complete report configuration
        
        Args:
            config: Report configuration to validate
            
        Returns:
            Dict with validation results
        """
        errors = []
        warnings = []
        
        # Required fields
        required_fields = ['name', 'query_config', 'schedule']
        for field in required_fields:
            if field not in config or not config[field]:
                errors.append(f"Missing required field: {field}")
        
        # Validate name
        if 'name' in config:
            if len(config['name']) < 3:
                errors.append("Report name must be at least 3 characters")
            if len(config['name']) > 100:
                errors.append("Report name must be less than 100 characters")
        
        # Validate query configuration
        if 'query_config' in config:
            query_validation = ReportConfigValidator.validate_query_config(config['query_config'])
            errors.extend(query_validation['errors'])
            warnings.extend(query_validation['warnings'])
        
        # Validate schedule
        if 'schedule' in config:
            schedule_validation = ReportConfigValidator.validate_schedule_config(config['schedule'])
            errors.extend(schedule_validation['errors'])
            warnings.extend(schedule_validation['warnings'])
        
        # Validate output format
        if 'output_format' in config:
            valid_formats = [f.value for f in OutputFormat]
            if config['output_format'] not in valid_formats:
                errors.append(f"Invalid output format. Must be one of: {valid_formats}")
        
        # Validate delivery method
        if 'delivery_method' in config:
            valid_methods = [m.value for m in DeliveryMethod]
            if config['delivery_method'] not in valid_methods:
                errors.append(f"Invalid delivery method. Must be one of: {valid_methods}")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    @staticmethod
    def validate_query_config(query_config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate query configuration"""
        errors = []
        warnings = []
        
        # Check required fields
        if 'data_sources' not in query_config:
            errors.append("Query configuration must specify data_sources")
        else:
            valid_sources = [s.value for s in DataSource]
            for source in query_config['data_sources']:
                if source not in valid_sources:
                    errors.append(f"Invalid data source: {source}")
        
        # Validate date range
        if 'date_range' in query_config:
            date_range = query_config['date_range']
            if not isinstance(date_range, int) or date_range < 1:
                errors.append("Date range must be a positive integer")
            elif date_range > 365:
                warnings.append("Date range longer than 365 days may impact performance")
        
        # Validate brand name
        if 'brand_name' in query_config:
            if not query_config['brand_name'].strip():
                warnings.append("Brand name is empty - this may affect search results")
        
        return {
            'errors': errors,
            'warnings': warnings
        }
    
    @staticmethod
    def validate_schedule_config(schedule_config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate schedule configuration"""
        errors = []
        warnings = []
        
        schedule_type = schedule_config.get('type')
        if not schedule_type:
            errors.append("Schedule must specify a type")
            return {'errors': errors, 'warnings': warnings}
        
        valid_types = [t.value for t in ScheduleType]
        if schedule_type not in valid_types:
            errors.append(f"Invalid schedule type. Must be one of: {valid_types}")
            return {'errors': errors, 'warnings': warnings}
        
        if schedule_type == ScheduleType.INTERVAL.value:
            # Validate interval configuration
            interval_type = schedule_config.get('interval_type')
            interval_value = schedule_config.get('interval_value')
            
            if not interval_type:
                errors.append("Interval schedule must specify interval_type")
            else:
                valid_intervals = [t.value for t in IntervalType]
                if interval_type not in valid_intervals:
                    errors.append(f"Invalid interval type. Must be one of: {valid_intervals}")
            
            if not interval_value:
                errors.append("Interval schedule must specify interval_value")
            elif not isinstance(interval_value, int) or interval_value < 1:
                errors.append("Interval value must be a positive integer")
            elif interval_type == IntervalType.MINUTES.value and interval_value < 15:
                warnings.append("Very frequent schedules (< 15 minutes) may impact system performance")
        
        elif schedule_type == ScheduleType.CRON.value:
            # Validate cron configuration
            cron_expression = schedule_config.get('cron_expression')
            if cron_expression:
                try:
                    from croniter import croniter
                    if not croniter.is_valid(cron_expression):
                        errors.append("Invalid cron expression")
                except ImportError:
                    warnings.append("Cannot validate cron expression - croniter not available")
            else:
                # Check individual cron fields
                cron_fields = ['minute', 'hour', 'day', 'month', 'day_of_week']
                missing_fields = [f for f in cron_fields if f not in schedule_config]
                if missing_fields and not cron_expression:
                    warnings.append(f"Consider specifying cron fields: {missing_fields}")
        
        return {
            'errors': errors,
            'warnings': warnings
        }

class ReportConfigManager:
    """Manage report configurations and templates"""
    
    @staticmethod
    def get_available_templates() -> Dict[str, Dict[str, Any]]:
        """Get all available report templates"""
        return {
            'mentions_summary': ReportTemplate.MENTIONS_SUMMARY,
            'traffic_analysis': ReportTemplate.TRAFFIC_ANALYSIS,
            'attribution_digest': ReportTemplate.ATTRIBUTION_DIGEST,
            'campaign_performance': ReportTemplate.CAMPAIGN_PERFORMANCE,
            'sentiment_analysis': ReportTemplate.SENTIMENT_ANALYSIS
        }
    
    @staticmethod
    def create_config_from_template(template_name: str, customizations: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a report configuration from a template
        
        Args:
            template_name: Name of the template to use
            customizations: Custom settings to override template defaults
            
        Returns:
            Complete report configuration
        """
        templates = ReportConfigManager.get_available_templates()
        
        if template_name not in templates:
            raise ValueError(f"Unknown template: {template_name}")
        
        template = templates[template_name]
        customizations = customizations or {}
        
        # Build configuration
        config = {
            'name': customizations.get('name', template['name']),
            'description': customizations.get('description', template['description']),
            'query_config': {
                'data_sources': template['data_sources'],
                **template['default_query'],
                **customizations.get('query_config', {})
            },
            'output_format': customizations.get('output_format', OutputFormat.CSV.value),
            'delivery_method': customizations.get('delivery_method', DeliveryMethod.FILE.value),
            'schedule': customizations.get('schedule', {
                'type': ScheduleType.INTERVAL.value,
                'interval_type': IntervalType.DAYS.value,
                'interval_value': 1
            }),
            'enabled': customizations.get('enabled', True)
        }
        
        # Add template metadata
        config['template_name'] = template_name
        config['output_columns'] = template['output_columns']
        config['summary_metrics'] = template['summary_metrics']
        
        return config
    
    @staticmethod
    def get_data_source_requirements(data_sources: List[str]) -> Dict[str, List[str]]:
        """Get API requirements for specified data sources
        
        Args:
            data_sources: List of data source names
            
        Returns:
            Dictionary mapping data sources to required API keys/configs
        """
        requirements = {}
        
        for source in data_sources:
            if source == DataSource.SCRAPE_CREATORS.value:
                requirements[source] = ['SCRAPE_CREATORS_API_KEY']
            elif source == DataSource.EXA_SEARCH.value:
                requirements[source] = ['EXA_API_KEY']
            elif source == DataSource.GA4_ANALYTICS.value:
                requirements[source] = ['GA4_PROPERTY_ID', 'GA4_CREDENTIALS_PATH or GA4_CREDENTIALS_JSON']
            elif source == DataSource.LIVE_FEED.value:
                requirements[source] = ['Live feed data (cached mentions)']
            elif source == DataSource.DASHBOARD_SIGNALS.value:
                requirements[source] = ['Dashboard state (signals, campaigns, echoes)']
        
        return requirements
    
    @staticmethod
    def suggest_schedule_for_data_sources(data_sources: List[str]) -> Dict[str, Any]:
        """Suggest appropriate schedule based on data sources
        
        Args:
            data_sources: List of data source names
            
        Returns:
            Suggested schedule configuration
        """
        # Real-time sources can be updated more frequently
        realtime_sources = [DataSource.LIVE_FEED.value, DataSource.DASHBOARD_SIGNALS.value]
        
        # API sources have rate limits
        api_sources = [DataSource.SCRAPE_CREATORS.value, DataSource.EXA_SEARCH.value, DataSource.GA4_ANALYTICS.value]
        
        has_realtime = any(source in realtime_sources for source in data_sources)
        has_api = any(source in api_sources for source in data_sources)
        
        if has_api and not has_realtime:
            # Conservative schedule for API-only reports
            return {
                'type': ScheduleType.INTERVAL.value,
                'interval_type': IntervalType.HOURS.value,
                'interval_value': 6
            }
        elif has_realtime and not has_api:
            # More frequent for real-time only
            return {
                'type': ScheduleType.INTERVAL.value,
                'interval_type': IntervalType.HOURS.value,
                'interval_value': 1
            }
        else:
            # Balanced approach for mixed sources
            return {
                'type': ScheduleType.INTERVAL.value,
                'interval_type': IntervalType.HOURS.value,
                'interval_value': 4
            }

# Export commonly used functions
__all__ = [
    'ReportTemplate',
    'QueryBuilder', 
    'ReportConfigValidator',
    'ReportConfigManager',
    'ScheduleType',
    'IntervalType',
    'OutputFormat',
    'DeliveryMethod',
    'DataSource'
]