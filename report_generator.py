#!/usr/bin/env python3
"""
Report Generator
Generates reports from various data sources based on configuration
"""

import os
import json
import csv
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import tempfile
from pathlib import Path

# Import existing integrations
try:
    from scrape_creators_integration import ScrapeCreatorsIntegration
    SCRAPE_CREATORS_AVAILABLE = True
except ImportError:
    SCRAPE_CREATORS_AVAILABLE = False

try:
    from exa_search_integration import ExaSearchIntegration
    EXA_SEARCH_AVAILABLE = True
except ImportError:
    EXA_SEARCH_AVAILABLE = False

try:
    from google_analytics_integration import GoogleAnalyticsIntegration
    GA4_ANALYTICS_AVAILABLE = True
except ImportError:
    GA4_ANALYTICS_AVAILABLE = False

logger = logging.getLogger(__name__)

class ReportGenerator:
    """Generate reports from various data sources"""
    
    def __init__(self, cache_dir: str = 'data_cache', output_dir: str = 'reports'):
        self.cache_dir = cache_dir
        self.output_dir = output_dir
        
        # Ensure directories exist
        os.makedirs(cache_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)
    
    def generate_report(self, report_config: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a report based on configuration
        
        Args:
            report_config: Report configuration containing query and output settings
            
        Returns:
            Dictionary with generation results
        """
        report_id = report_config.get('id', 'unknown')
        report_name = report_config.get('name', 'Untitled Report')
        
        logger.info(f"Generating report: {report_name} (ID: {report_id})")
        
        # Extract configuration
        query_config = report_config.get('query_config', {})
        output_format = report_config.get('output_format', 'csv')
        data_sources = query_config.get('data_sources', [])
        
        # Collect data from all sources
        all_data = []
        data_summary = {}
        
        for source in data_sources:
            try:
                source_data = self._fetch_data_from_source(source, query_config)
                if source_data:
                    all_data.extend(source_data)
                    data_summary[source] = len(source_data)
                    logger.info(f"Collected {len(source_data)} records from {source}")
                else:
                    data_summary[source] = 0
                    logger.warning(f"No data collected from {source}")
            except Exception as e:
                logger.error(f"Error collecting data from {source}: {e}")
                data_summary[source] = 0
        
        # Generate output files
        output_files = []
        
        if all_data:
            # Create base filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base_filename = f"{report_name.replace(' ', '_').lower()}_{timestamp}"
            
            # Generate requested format
            if output_format == 'csv':
                csv_file = self._generate_csv_report(all_data, base_filename, report_config)
                output_files.append(csv_file)
            elif output_format == 'json':
                json_file = self._generate_json_report(all_data, base_filename, report_config)
                output_files.append(json_file)
            elif output_format == 'html':
                html_file = self._generate_html_report(all_data, base_filename, report_config)
                output_files.append(html_file)
            
            # Always generate a summary JSON
            summary_file = self._generate_summary_report(all_data, data_summary, base_filename, report_config)
            output_files.append(summary_file)
        
        return {
            'success': True,
            'records_count': len(all_data),
            'data_summary': data_summary,
            'output_files': output_files,
            'generated_at': datetime.now().isoformat()
        }
    
    def _fetch_data_from_source(self, source: str, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch data from a specific source
        
        Args:
            source: Data source name
            query_config: Query configuration
            
        Returns:
            List of data records
        """
        if source == 'scrape_creators':
            return self._fetch_scrape_creators_data(query_config)
        elif source == 'exa_search':
            return self._fetch_exa_search_data(query_config)
        elif source == 'ga4_analytics':
            return self._fetch_ga4_data(query_config)
        elif source == 'live_feed':
            return self._fetch_live_feed_data(query_config)
        elif source == 'dashboard_signals':
            return self._fetch_dashboard_signals_data(query_config)
        else:
            logger.warning(f"Unknown data source: {source}")
            return []
    
    def _fetch_scrape_creators_data(self, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch data from ScrapeCreators API"""
        if not SCRAPE_CREATORS_AVAILABLE:
            logger.warning("ScrapeCreators integration not available")
            return []
        
        try:
            # Get API key from environment or session
            api_key = os.getenv('SCRAPE_CREATORS_API_KEY')
            if not api_key:
                logger.warning("ScrapeCreators API key not configured")
                return []
            
            brand_name = query_config.get('brand_name', '')
            if not brand_name:
                logger.warning("Brand name not specified for ScrapeCreators query")
                return []
            
            # Create integration instance
            integration = ScrapeCreatorsIntegration(api_key, brand_name)
            
            # Build query parameters
            platforms = query_config.get('platforms', ['tiktok', 'youtube', 'reddit'])
            days_back = query_config.get('date_range', 7)
            
            # Fetch mentions
            mentions = integration.fetch_mentions(platforms, days_back)
            
            # Normalize data format
            normalized_data = []
            for mention in mentions:
                normalized_data.append({
                    'timestamp': mention.get('created_at', mention.get('timestamp', '')),
                    'platform': mention.get('platform', 'unknown'),
                    'content': mention.get('content', ''),
                    'sentiment': mention.get('sentiment', 'neutral'),
                    'engagement': mention.get('engagement', 0),
                    'author': mention.get('author', ''),
                    'url': mention.get('url', ''),
                    'source': 'scrape_creators',
                    'relevance_score': mention.get('relevance_score', 0)
                })
            
            return normalized_data
            
        except Exception as e:
            logger.error(f"Error fetching ScrapeCreators data: {e}")
            return []
    
    def _fetch_exa_search_data(self, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch data from Exa Search API"""
        if not EXA_SEARCH_AVAILABLE:
            logger.warning("Exa Search integration not available")
            return []
        
        try:
            # Get API key from environment
            api_key = os.getenv('EXA_API_KEY')
            if not api_key:
                logger.warning("Exa Search API key not configured")
                return []
            
            brand_name = query_config.get('brand_name', '')
            if not brand_name:
                logger.warning("Brand name not specified for Exa Search query")
                return []
            
            # Create integration instance
            integration = ExaSearchIntegration(api_key, brand_name)
            
            # Build query parameters
            days_back = query_config.get('date_range', 7)
            max_results = query_config.get('max_results', 100)
            
            # Fetch mentions
            mentions = integration.search_mentions(days_back, max_results)
            
            # Normalize data format
            normalized_data = []
            for mention in mentions:
                normalized_data.append({
                    'timestamp': mention.get('published_date', ''),
                    'platform': 'web',
                    'content': mention.get('content', ''),
                    'sentiment': mention.get('sentiment', 'neutral'),
                    'engagement': 0,  # Exa doesn't provide engagement metrics
                    'author': mention.get('author', ''),
                    'url': mention.get('url', ''),
                    'source': 'exa_search',
                    'domain': mention.get('domain', ''),
                    'relevance_score': mention.get('relevance_score', 0),
                    'title': mention.get('title', '')
                })
            
            return normalized_data
            
        except Exception as e:
            logger.error(f"Error fetching Exa Search data: {e}")
            return []
    
    def _fetch_ga4_data(self, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch data from GA4 Analytics"""
        if not GA4_ANALYTICS_AVAILABLE:
            logger.warning("GA4 Analytics integration not available")
            return []
        
        try:
            # Get GA4 configuration from environment
            property_id = os.getenv('GA4_PROPERTY_ID')
            credentials_path = os.getenv('GA4_CREDENTIALS_PATH')
            credentials_json = os.getenv('GA4_CREDENTIALS_JSON')
            
            if not property_id or (not credentials_path and not credentials_json):
                logger.warning("GA4 configuration not complete")
                return []
            
            # Create integration instance
            integration = GoogleAnalyticsIntegration(
                property_id=property_id,
                credentials_path=credentials_path,
                credentials_json=credentials_json
            )
            
            # Build query parameters
            days_back = query_config.get('date_range', 30)
            metrics = query_config.get('metrics', ['sessions', 'users'])
            
            # Fetch data based on metrics requested
            data = []
            
            if 'direct_traffic' in metrics or 'sessions' in metrics:
                direct_traffic = integration.get_direct_traffic_data(days_back)
                data.append({
                    'timestamp': datetime.now().isoformat(),
                    'metric_type': 'direct_traffic',
                    'value': direct_traffic.get('total_sessions', 0),
                    'source': 'ga4_analytics',
                    'period_days': days_back
                })
            
            if 'branded_search' in metrics:
                brand_name = query_config.get('brand_name', '')
                if brand_name:
                    branded_search = integration.get_branded_search_data([brand_name], days_back)
                    data.append({
                        'timestamp': datetime.now().isoformat(),
                        'metric_type': 'branded_search',
                        'value': branded_search.get('estimated_branded_sessions', 0),
                        'source': 'ga4_analytics',
                        'period_days': days_back
                    })
            
            return data
            
        except Exception as e:
            logger.error(f"Error fetching GA4 data: {e}")
            return []
    
    def _fetch_live_feed_data(self, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch data from cached live feed mentions"""
        try:
            mentions_cache_file = os.path.join(self.cache_dir, 'mentions_cache.json')
            
            if not os.path.exists(mentions_cache_file):
                logger.warning("No cached mentions data available")
                return []
            
            with open(mentions_cache_file, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            mentions = cache_data.get('mentions', [])
            
            # Apply date filter
            date_range = query_config.get('date_range', 7)
            cutoff_date = datetime.now() - timedelta(days=date_range)
            
            filtered_mentions = []
            for mention in mentions:
                try:
                    mention_date = datetime.fromisoformat(mention.get('timestamp', '').replace('Z', '+00:00'))
                    if mention_date >= cutoff_date:
                        filtered_mentions.append(mention)
                except:
                    # Include mentions with invalid timestamps
                    filtered_mentions.append(mention)
            
            return filtered_mentions
            
        except Exception as e:
            logger.error(f"Error fetching live feed data: {e}")
            return []
    
    def _fetch_dashboard_signals_data(self, query_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch dashboard signals data"""
        try:
            # This would typically come from the dashboard state
            # For now, we'll create a placeholder structure
            data = []
            
            # Add current timestamp
            current_time = datetime.now().isoformat()
            
            # Mock signal data - in a real implementation, this would come from
            # the actual dashboard state or a signals cache file
            signals = [
                {'metric': 'branded_search_volume', 'value': 2847},
                {'metric': 'direct_traffic', 'value': 1234},
                {'metric': 'inbound_messages', 'value': 89},
                {'metric': 'community_engagement', 'value': 156},
                {'metric': 'first_party_data', 'value': 67},
                {'metric': 'attribution_score', 'value': 8.7}
            ]
            
            for signal in signals:
                data.append({
                    'timestamp': current_time,
                    'metric_type': signal['metric'],
                    'value': signal['value'],
                    'source': 'dashboard_signals'
                })
            
            return data
            
        except Exception as e:
            logger.error(f"Error fetching dashboard signals data: {e}")
            return []
    
    def _generate_csv_report(self, data: List[Dict[str, Any]], base_filename: str, report_config: Dict[str, Any]) -> str:
        """Generate CSV report file"""
        try:
            filename = f"{base_filename}.csv"
            filepath = os.path.join(self.output_dir, filename)
            
            if not data:
                # Create empty file with headers
                with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow(['timestamp', 'source', 'message'])
                    writer.writerow([datetime.now().isoformat(), 'system', 'No data available for this report'])
                return filepath
            
            # Get all unique keys from data
            all_keys = set()
            for item in data:
                all_keys.update(item.keys())
            
            # Use configured columns if available, otherwise use all keys
            output_columns = report_config.get('output_columns', sorted(all_keys))
            
            with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=output_columns, extrasaction='ignore')
                writer.writeheader()
                writer.writerows(data)
            
            logger.info(f"Generated CSV report: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating CSV report: {e}")
            raise
    
    def _generate_json_report(self, data: List[Dict[str, Any]], base_filename: str, report_config: Dict[str, Any]) -> str:
        """Generate JSON report file"""
        try:
            filename = f"{base_filename}.json"
            filepath = os.path.join(self.output_dir, filename)
            
            report_data = {
                'report_info': {
                    'name': report_config.get('name', 'Untitled Report'),
                    'description': report_config.get('description', ''),
                    'generated_at': datetime.now().isoformat(),
                    'record_count': len(data)
                },
                'data': data
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, default=str)
            
            logger.info(f"Generated JSON report: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating JSON report: {e}")
            raise
    
    def _generate_html_report(self, data: List[Dict[str, Any]], base_filename: str, report_config: Dict[str, Any]) -> str:
        """Generate HTML report file"""
        try:
            filename = f"{base_filename}.html"
            filepath = os.path.join(self.output_dir, filename)
            
            # Create simple HTML report
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <title>{report_config.get('name', 'Report')}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        h1 {{ color: #333; }}
        table {{ border-collapse: collapse; width: 100%; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        .summary {{ background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }}
    </style>
</head>
<body>
    <h1>{report_config.get('name', 'Report')}</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        <p><strong>Records:</strong> {len(data)}</p>
        <p><strong>Description:</strong> {report_config.get('description', 'No description provided')}</p>
    </div>
    
    <h2>Data</h2>
"""
            
            if data:
                # Get columns for table
                output_columns = report_config.get('output_columns', sorted(data[0].keys()))
                
                html_content += "<table>\n<thead>\n<tr>\n"
                for col in output_columns:
                    html_content += f"<th>{col}</th>\n"
                html_content += "</tr>\n</thead>\n<tbody>\n"
                
                # Add data rows (limit to first 1000 for performance)
                for row in data[:1000]:
                    html_content += "<tr>\n"
                    for col in output_columns:
                        value = str(row.get(col, ''))
                        # Escape HTML characters
                        value = value.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;')
                        html_content += f"<td>{value}</td>\n"
                    html_content += "</tr>\n"
                
                html_content += "</tbody>\n</table>\n"
                
                if len(data) > 1000:
                    html_content += f"<p><em>Showing first 1000 of {len(data)} records</em></p>\n"
            else:
                html_content += "<p>No data available</p>\n"
            
            html_content += """
</body>
</html>
"""
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"Generated HTML report: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating HTML report: {e}")
            raise
    
    def _generate_summary_report(self, data: List[Dict[str, Any]], data_summary: Dict[str, int], 
                                base_filename: str, report_config: Dict[str, Any]) -> str:
        """Generate summary report file"""
        try:
            filename = f"{base_filename}_summary.json"
            filepath = os.path.join(self.output_dir, filename)
            
            # Calculate summary metrics
            total_records = len(data)
            
            # Platform breakdown
            platform_counts = {}
            sentiment_counts = {'positive': 0, 'negative': 0, 'neutral': 0}
            
            for item in data:
                platform = item.get('platform', 'unknown')
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
                
                sentiment = item.get('sentiment', 'neutral')
                if sentiment in sentiment_counts:
                    sentiment_counts[sentiment] += 1
            
            # Create summary
            summary = {
                'report_info': {
                    'name': report_config.get('name', 'Untitled Report'),
                    'description': report_config.get('description', ''),
                    'generated_at': datetime.now().isoformat(),
                    'query_config': report_config.get('query_config', {})
                },
                'data_summary': {
                    'total_records': total_records,
                    'records_by_source': data_summary,
                    'platform_breakdown': platform_counts,
                    'sentiment_breakdown': sentiment_counts
                },
                'metrics': self._calculate_summary_metrics(data, report_config)
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, default=str)
            
            logger.info(f"Generated summary report: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating summary report: {e}")
            raise
    
    def _calculate_summary_metrics(self, data: List[Dict[str, Any]], report_config: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate summary metrics for the report"""
        metrics = {}
        
        if not data:
            return metrics
        
        # Calculate based on configured summary metrics
        summary_metrics = report_config.get('summary_metrics', [])
        
        if 'total_mentions' in summary_metrics:
            metrics['total_mentions'] = len(data)
        
        if 'sentiment_breakdown' in summary_metrics:
            sentiment_counts = {'positive': 0, 'negative': 0, 'neutral': 0}
            for item in data:
                sentiment = item.get('sentiment', 'neutral')
                if sentiment in sentiment_counts:
                    sentiment_counts[sentiment] += 1
            metrics['sentiment_breakdown'] = sentiment_counts
        
        if 'platform_breakdown' in summary_metrics:
            platform_counts = {}
            for item in data:
                platform = item.get('platform', 'unknown')
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
            metrics['platform_breakdown'] = platform_counts
        
        if 'engagement_stats' in summary_metrics:
            engagements = [item.get('engagement', 0) for item in data if isinstance(item.get('engagement'), (int, float))]
            if engagements:
                metrics['engagement_stats'] = {
                    'total': sum(engagements),
                    'average': sum(engagements) / len(engagements),
                    'max': max(engagements),
                    'min': min(engagements)
                }
        
        return metrics

# Example usage and testing
if __name__ == '__main__':
    # Test report generation
    generator = ReportGenerator()
    
    # Sample report configuration
    test_config = {
        'id': 'test-report',
        'name': 'Test Report',
        'description': 'Test report generation',
        'query_config': {
            'data_sources': ['live_feed'],
            'date_range': 7,
            'brand_name': 'TestBrand'
        },
        'output_format': 'csv',
        'output_columns': ['timestamp', 'platform', 'content', 'sentiment'],
        'summary_metrics': ['total_mentions', 'sentiment_breakdown']
    }
    
    try:
        result = generator.generate_report(test_config)
        print("Report generation test successful:")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Report generation test failed: {e}")