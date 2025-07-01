#!/usr/bin/env python3
"""
Google Analytics 4 Integration for Attribution Dashboard
Fetches direct traffic and branded search data from GA4
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        RunReportRequest,
        Dimension,
        Metric,
        DateRange,
        FilterExpression,
        Filter,
        FilterExpressionList
    )
    from google.oauth2 import service_account
    GA4_AVAILABLE = True
except ImportError:
    GA4_AVAILABLE = False
    # Create dummy types for when GA4 is not available
    Credentials = None

logger = logging.getLogger(__name__)

class GoogleAnalyticsIntegration:
    """Google Analytics 4 integration for fetching direct traffic and search data"""
    
    def __init__(self, property_id: str, credentials_path: str = None, credentials_json: str = None):
        """
        Initialize GA4 integration
        
        Args:
            property_id: GA4 Property ID (format: properties/123456789)
            credentials_path: Path to service account JSON file
            credentials_json: Service account JSON as string
        """
        if not GA4_AVAILABLE:
            raise ImportError("Google Analytics Data API not available. Install with: pip install google-analytics-data")
        
        self.property_id = property_id
        if not self.property_id.startswith('properties/'):
            self.property_id = f'properties/{property_id}'
        
        # Initialize credentials
        self.credentials = self._setup_credentials(credentials_path, credentials_json)
        self.client = BetaAnalyticsDataClient(credentials=self.credentials)
        
        logger.info(f"GA4 Integration initialized for property: {self.property_id}")
    
    def _setup_credentials(self, credentials_path: str = None, credentials_json: str = None):
        """Setup Google Analytics credentials"""
        try:
            if credentials_json:
                # Use JSON string directly
                credentials_info = json.loads(credentials_json)
                return service_account.Credentials.from_service_account_info(
                    credentials_info,
                    scopes=['https://www.googleapis.com/auth/analytics.readonly']
                )
            elif credentials_path and os.path.exists(credentials_path):
                # Use JSON file
                return service_account.Credentials.from_service_account_file(
                    credentials_path,
                    scopes=['https://www.googleapis.com/auth/analytics.readonly']
                )
            else:
                # Try default credentials (for Google Cloud environments)
                from google.auth import default
                credentials, _ = default(scopes=['https://www.googleapis.com/auth/analytics.readonly'])
                return credentials
        except Exception as e:
            logger.error(f"Failed to setup GA4 credentials: {e}")
            raise
    
    def get_direct_traffic_data(self, days_back: int = 7) -> Dict[str, Any]:
        """
        Fetch direct traffic data from GA4
        
        Args:
            days_back: Number of days to look back
            
        Returns:
            Dict containing direct traffic metrics
        """
        try:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days_back)
            
            # Create the request
            request = RunReportRequest(
                property=self.property_id,
                dimensions=[
                    Dimension(name="date"),
                    Dimension(name="sessionDefaultChannelGrouping"),
                ],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="totalUsers"),
                    Metric(name="screenPageViews"),
                    Metric(name="bounceRate"),
                    Metric(name="averageSessionDuration")
                ],
                date_ranges=[DateRange(
                    start_date=start_date.strftime('%Y-%m-%d'),
                    end_date=end_date.strftime('%Y-%m-%d')
                )],
                dimension_filter=FilterExpression(
                    filter=Filter(
                        field_name="sessionDefaultChannelGrouping",
                        string_filter=Filter.StringFilter(
                            match_type=Filter.StringFilter.MatchType.EXACT,
                            value="Direct"
                        )
                    )
                )
            )
            
            # Execute request
            response = self.client.run_report(request)
            
            # Process response
            direct_traffic_data = []
            total_sessions = 0
            total_users = 0
            total_pageviews = 0
            
            for row in response.rows:
                date_str = row.dimension_values[0].value
                sessions = int(row.metric_values[0].value) if row.metric_values[0].value else 0
                users = int(row.metric_values[1].value) if row.metric_values[1].value else 0
                pageviews = int(row.metric_values[2].value) if row.metric_values[2].value else 0
                bounce_rate = float(row.metric_values[3].value) if row.metric_values[3].value else 0
                avg_duration = float(row.metric_values[4].value) if row.metric_values[4].value else 0
                
                direct_traffic_data.append({
                    'date': date_str,
                    'sessions': sessions,
                    'users': users,
                    'pageviews': pageviews,
                    'bounce_rate': bounce_rate,
                    'average_session_duration': avg_duration
                })
                
                total_sessions += sessions
                total_users += users
                total_pageviews += pageviews
            
            return {
                'total_sessions': total_sessions,
                'total_users': total_users,
                'total_pageviews': total_pageviews,
                'daily_data': direct_traffic_data,
                'date_range': {
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d')
                },
                'days_analyzed': days_back
            }
            
        except Exception as e:
            logger.error(f"Error fetching direct traffic data: {e}")
            raise
    
    def get_branded_search_data(self, brand_terms: List[str], days_back: int = 7) -> Dict[str, Any]:
        """
        Fetch branded search traffic data from GA4
        
        Args:
            brand_terms: List of brand terms to search for
            days_back: Number of days to look back
            
        Returns:
            Dict containing branded search metrics
        """
        try:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days_back)
            
            # Create filter for organic search traffic
            organic_filter = FilterExpression(
                filter=Filter(
                    field_name="sessionDefaultChannelGrouping",
                    string_filter=Filter.StringFilter(
                        match_type=Filter.StringFilter.MatchType.EXACT,
                        value="Organic Search"
                    )
                )
            )
            
            request = RunReportRequest(
                property=self.property_id,
                dimensions=[
                    Dimension(name="date"),
                    Dimension(name="sessionDefaultChannelGrouping"),
                    Dimension(name="sessionSource"),
                ],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="totalUsers"),
                    Metric(name="screenPageViews")
                ],
                date_ranges=[DateRange(
                    start_date=start_date.strftime('%Y-%m-%d'),
                    end_date=end_date.strftime('%Y-%m-%d')
                )],
                dimension_filter=organic_filter
            )
            
            response = self.client.run_report(request)
            
            # Process response and estimate branded search
            organic_sessions = 0
            daily_data = []
            
            for row in response.rows:
                date_str = row.dimension_values[0].value
                source = row.dimension_values[2].value
                sessions = int(row.metric_values[0].value) if row.metric_values[0].value else 0
                users = int(row.metric_values[1].value) if row.metric_values[1].value else 0
                pageviews = int(row.metric_values[2].value) if row.metric_values[2].value else 0
                
                daily_data.append({
                    'date': date_str,
                    'source': source,
                    'sessions': sessions,
                    'users': users,
                    'pageviews': pageviews
                })
                
                organic_sessions += sessions
            
            # Estimate branded search (typically 20-40% of organic search for established brands)
            estimated_branded_sessions = int(organic_sessions * 0.3)  # Conservative 30% estimate
            
            return {
                'estimated_branded_sessions': estimated_branded_sessions,
                'total_organic_sessions': organic_sessions,
                'daily_data': daily_data,
                'date_range': {
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d')
                },
                'days_analyzed': days_back,
                'note': 'Branded search is estimated as 30% of organic search traffic'
            }
            
        except Exception as e:
            logger.error(f"Error fetching branded search data: {e}")
            raise
    
    def get_landing_page_data(self, days_back: int = 7) -> Dict[str, Any]:
        """
        Fetch landing page data to identify direct traffic patterns
        
        Args:
            days_back: Number of days to look back
            
        Returns:
            Dict containing landing page metrics for direct traffic
        """
        try:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days_back)
            
            request = RunReportRequest(
                property=self.property_id,
                dimensions=[
                    Dimension(name="landingPage"),
                    Dimension(name="sessionDefaultChannelGrouping"),
                ],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="totalUsers"),
                    Metric(name="bounceRate")
                ],
                date_ranges=[DateRange(
                    start_date=start_date.strftime('%Y-%m-%d'),
                    end_date=end_date.strftime('%Y-%m-%d')
                )],
                dimension_filter=FilterExpression(
                    filter=Filter(
                        field_name="sessionDefaultChannelGrouping",
                        string_filter=Filter.StringFilter(
                            match_type=Filter.StringFilter.MatchType.EXACT,
                            value="Direct"
                        )
                    )
                ),
                limit=20  # Top 20 landing pages
            )
            
            response = self.client.run_report(request)
            
            landing_pages = []
            for row in response.rows:
                landing_page = row.dimension_values[0].value
                sessions = int(row.metric_values[0].value) if row.metric_values[0].value else 0
                users = int(row.metric_values[1].value) if row.metric_values[1].value else 0
                bounce_rate = float(row.metric_values[2].value) if row.metric_values[2].value else 0
                
                landing_pages.append({
                    'landing_page': landing_page,
                    'sessions': sessions,
                    'users': users,
                    'bounce_rate': bounce_rate
                })
            
            return {
                'landing_pages': landing_pages,
                'date_range': {
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d')
                },
                'days_analyzed': days_back
            }
            
        except Exception as e:
            logger.error(f"Error fetching landing page data: {e}")
            raise
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test the GA4 connection
        
        Returns:
            Dict with connection status and basic property info
        """
        try:
            # Simple test request - get basic property data for last day
            request = RunReportRequest(
                property=self.property_id,
                metrics=[Metric(name="sessions")],
                date_ranges=[DateRange(
                    start_date="yesterday",
                    end_date="yesterday"
                )]
            )
            
            response = self.client.run_report(request)
            sessions = int(response.rows[0].metric_values[0].value) if response.rows else 0
            
            return {
                'status': 'success',
                'property_id': self.property_id,
                'yesterday_sessions': sessions,
                'message': 'GA4 connection successful'
            }
            
        except Exception as e:
            logger.error(f"GA4 connection test failed: {e}")
            return {
                'status': 'error',
                'property_id': self.property_id,
                'error': str(e),
                'message': 'GA4 connection failed'
            }

# Example usage and testing
if __name__ == "__main__":
    # Example usage
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python google_analytics_integration.py <property_id> [credentials_path]")
        print("Example: python google_analytics_integration.py 123456789 /path/to/service-account.json")
        sys.exit(1)
    
    property_id = sys.argv[1]
    credentials_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        # Initialize integration
        ga = GoogleAnalyticsIntegration(property_id, credentials_path)
        
        # Test connection
        print("Testing GA4 connection...")
        test_result = ga.test_connection()
        print(f"Connection test: {test_result}")
        
        if test_result['status'] == 'success':
            # Get direct traffic data
            print("\nFetching direct traffic data...")
            direct_data = ga.get_direct_traffic_data(days_back=7)
            print(f"Direct traffic sessions (7 days): {direct_data['total_sessions']}")
            
            # Get branded search estimate
            print("\nFetching branded search data...")
            branded_data = ga.get_branded_search_data(['your-brand'], days_back=7)
            print(f"Estimated branded search sessions (7 days): {branded_data['estimated_branded_sessions']}")
            
            # Get landing pages
            print("\nFetching top landing pages for direct traffic...")
            landing_data = ga.get_landing_page_data(days_back=7)
            print(f"Top 5 direct traffic landing pages:")
            for page in landing_data['landing_pages'][:5]:
                print(f"  {page['landing_page']}: {page['sessions']} sessions")
                
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1) 