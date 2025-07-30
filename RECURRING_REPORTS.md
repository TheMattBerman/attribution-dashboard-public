# Recurring Reports System

The Attribution Dashboard now includes a powerful recurring reports system that allows users to create custom searches and queries that run automatically at scheduled intervals. This feature enables continuous monitoring and automated data collection from all integrated sources.

## Overview

The recurring reports system consists of several key components:

- **Scheduler Service**: Manages job scheduling and execution using APScheduler
- **Report Configuration**: Flexible system for defining data sources, queries, and output formats
- **Report Generator**: Creates reports from various data sources with multiple output formats
- **Frontend Interface**: User-friendly web interface for managing reports
- **Template System**: Pre-built report templates for common use cases

## Features

### 🔄 Automated Scheduling
- **Interval-based**: Run every X hours, days, or weeks
- **Cron expressions**: Advanced scheduling with cron syntax
- **Manual triggers**: Run reports on-demand
- **Job persistence**: Schedules survive server restarts

### 📊 Multiple Data Sources
- **ScrapeCreators**: Social media mentions (TikTok, YouTube, Reddit)
- **Exa Search**: Web-wide mention tracking
- **Google Analytics 4**: Traffic and behavioral data
- **Live Feed**: Cached mention data
- **Dashboard Signals**: Current attribution metrics

### 📋 Report Templates
- **Mentions Summary**: Brand mentions across all platforms
- **Traffic Analysis**: Direct traffic and branded search analysis
- **Attribution Digest**: Comprehensive attribution tracking
- **Campaign Performance**: Marketing campaign analysis
- **Sentiment Analysis**: Detailed sentiment tracking

### 📄 Output Formats
- **CSV**: Spreadsheet-compatible data export
- **JSON**: Structured data for APIs and processing
- **HTML**: Human-readable web reports
- **Summary Reports**: Executive-level insights

## Installation

### 1. Install Dependencies

```bash
pip install APScheduler croniter
```

### 2. Verify Installation

The system will automatically detect if dependencies are available when you start the backend server:

```bash
python3 backend_server.py
```

Look for this message in the startup output:
```
Recurring Reports: ✓ Available
📋 Recurring Reports: Scheduler initialized
```

### 3. Access the Interface

Navigate to the **Recurring Reports** section in the dashboard sidebar.

## Usage Guide

### Creating Your First Report

#### Method 1: Use a Template (Recommended)

1. Click **"Use Template"** in the Recurring Reports section
2. Select a template from the dropdown
3. Review the template information including:
   - Data sources required
   - API requirements
   - Suggested schedule
4. Customize the report name and schedule
5. Click **"Create Report"**

#### Method 2: Create Custom Report

1. Click **"Create Report"** in the Recurring Reports section
2. Configure the report:
   - **Name**: Descriptive name for your report
   - **Description**: Optional description
   - **Data Sources**: Select which APIs to query
   - **Date Range**: How many days of historical data to include
   - **Output Format**: CSV, JSON, or HTML
   - **Schedule**: When and how often to run
3. Click **"Create Report"**

### Managing Reports

#### View Report Status
The dashboard shows:
- Total number of reports
- Number of active reports
- Recent executions (last 7 days)
- Failed executions
- Upcoming scheduled runs

#### Report Actions
For each report, you can:
- **Run Now**: Execute immediately
- **View History**: See execution logs and results
- **Edit**: Modify configuration (coming soon)
- **Enable/Disable**: Toggle active status
- **Delete**: Remove permanently

### Understanding Report Cards

Each report displays:
- **Status**: Active or Disabled
- **Schedule**: How often it runs
- **Data Sources**: Which APIs it queries
- **Output Format**: File format produced
- **Statistics**: Run count, last run, next run

## API Reference

### Endpoints

#### List Reports
```http
GET /api/reports
```

Response:
```json
{
  "status": "success",
  "data": [...],
  "total_count": 5
}
```

#### Create Report
```http
POST /api/reports
```

Request body:
```json
{
  "name": "Daily Mentions Report",
  "description": "Track daily brand mentions",
  "query_config": {
    "data_sources": ["scrape_creators", "exa_search"],
    "date_range": 7,
    "brand_name": "YourBrand"
  },
  "schedule": {
    "type": "interval",
    "interval_type": "days",
    "interval_value": 1
  },
  "output_format": "csv",
  "enabled": true
}
```

#### Run Report Manually
```http
POST /api/reports/{report_id}/run
```

#### Get Report History
```http
GET /api/reports/{report_id}/history?limit=50
```

#### Get Available Templates
```http
GET /api/reports/templates
```

#### Create from Template
```http
POST /api/reports/templates/{template_name}
```

Request body:
```json
{
  "name": "My Custom Report Name",
  "schedule": {
    "type": "interval",
    "interval_type": "hours",
    "interval_value": 6
  }
}
```

## Configuration Options

### Data Source Configuration

#### ScrapeCreators
```json
{
  "data_sources": ["scrape_creators"],
  "platforms": ["tiktok", "youtube", "reddit"],
  "date_range": 7,
  "brand_name": "YourBrand",
  "min_engagement": 0
}
```

#### Exa Search
```json
{
  "data_sources": ["exa_search"],
  "date_range": 7,
  "brand_name": "YourBrand",
  "max_results": 100,
  "domains": [],
  "exclude_domains": []
}
```

#### Google Analytics 4
```json
{
  "data_sources": ["ga4_analytics"],
  "date_range": 30,
  "metrics": ["sessions", "users", "direct_traffic", "branded_search"]
}
```

### Schedule Configuration

#### Interval-based
```json
{
  "type": "interval",
  "interval_type": "hours",  // hours, days, weeks
  "interval_value": 6
}
```

#### Cron-based
```json
{
  "type": "cron",
  "cron_expression": "0 9 * * *"  // Every day at 9 AM
}
```

Or using individual fields:
```json
{
  "type": "cron",
  "minute": "0",
  "hour": "9",
  "day": "*",
  "month": "*",
  "day_of_week": "*"
}
```

## File Structure

```
/
├── scheduler_service.py          # Core scheduler service
├── report_config.py             # Report templates and validation
├── report_generator.py          # Report generation engine
├── backend_server.py            # API endpoints (updated)
├── requirements.txt             # Dependencies (updated)
├── js/components/
│   └── recurring-reports.js     # Frontend component
├── index.html                   # UI integration (updated)
├── style.css                    # Styling (updated)
├── data_cache/
│   ├── scheduled_reports.json   # Report configurations
│   ├── report_jobs.json         # Job tracking
│   └── report_history.json      # Execution history
└── reports/                     # Generated report files
    ├── mentions_summary_20240130_143022.csv
    ├── traffic_analysis_20240130_143022.json
    └── attribution_digest_20240130_143022_summary.json
```

## Data Flow

1. **Configuration**: User creates report via frontend or API
2. **Validation**: System validates configuration and API requirements
3. **Scheduling**: APScheduler creates job with specified timing
4. **Execution**: Scheduler triggers report generator at scheduled time
5. **Data Collection**: Generator queries configured data sources
6. **Processing**: Data is normalized and formatted
7. **Output Generation**: Files created in specified format(s)
8. **History Logging**: Execution results stored for monitoring
9. **Delivery**: Reports saved to `reports/` directory (future: email/webhook delivery)

## Error Handling

The system includes comprehensive error handling:

### API Errors
- Missing API keys result in warnings, not failures
- Invalid configurations are validated before creation
- Rate limiting is respected for external APIs

### Execution Errors
- Failed executions are logged with detailed error messages
- Partial failures still generate reports with available data
- Retry logic for transient failures

### Data Validation
- All report configurations are validated before saving
- Schedule expressions are tested for validity
- Data source requirements are checked

## Performance Considerations

### Resource Usage
- Each report runs in a separate thread
- Maximum 20 concurrent executions (configurable)
- JSON file-based persistence minimizes memory usage

### Scheduling Recommendations
- Avoid very frequent schedules (< 15 minutes) for API-based reports
- Stagger report schedules to distribute load
- Use cached data sources for high-frequency reports

### Output Management
- Reports are stored in the `reports/` directory
- Large reports are automatically truncated in HTML view (1000 rows)
- Consider regular cleanup of old report files

## Troubleshooting

### Common Issues

#### "Recurring reports not available"
- Install dependencies: `pip install APScheduler croniter`
- Restart the backend server
- Check console for import errors

#### Reports not executing
- Check if the report is enabled
- Verify API keys are configured
- Review execution history for error messages
- Check server logs for scheduler errors

#### No data in reports
- Verify data source API keys are valid
- Check date range settings
- Ensure brand name is configured
- Test individual API integrations first

#### Schedule not working
- Validate cron expressions using online tools
- Check system timezone settings
- Verify scheduler is running (check status endpoint)

### Debug Information

Access debug information via:
- **Frontend**: Reports status section shows scheduler health
- **API**: `/api/reports/status` endpoint provides detailed metrics
- **Logs**: Backend server logs show execution details

### Log Locations
- Scheduler events: Console output when running backend server
- Execution history: Available via frontend history viewer
- Error details: Stored in report execution history

## Future Enhancements

### Planned Features
- **Email Delivery**: Send reports via email
- **Webhook Integration**: Push reports to external systems
- **Advanced Filtering**: More sophisticated query options
- **Report Editing**: Modify existing report configurations
- **Cloud Storage**: Integration with AWS S3, Google Drive
- **Data Visualization**: Built-in charts and graphs
- **Collaborative Features**: Share reports with team members

### Customization
The system is designed to be extensible:
- Add new data sources by extending `report_generator.py`
- Create custom templates in `report_config.py`
- Implement new output formats in the report generator
- Add delivery methods in a future `delivery_service.py`

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review execution history for specific error messages
3. Verify API integrations are working independently
4. Check the main project documentation and setup guides

The recurring reports system integrates seamlessly with the existing Attribution Dashboard, leveraging all configured APIs and data sources to provide comprehensive, automated reporting capabilities.