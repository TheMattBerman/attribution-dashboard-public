# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attribution Dashboard is a modular marketing attribution tracking system designed for the era of AI, answer engines, and "dark" social. It provides real-time monitoring of branded search volume, direct traffic, inbound mentions, and form fills through a combination of frontend JavaScript and Python backend APIs.

## Architecture

### Frontend (Browser-based)
- **index.html**: Main dashboard interface with responsive design
- **app.js**: Core JavaScript with dashboard state management and localStorage persistence
- **style.css**: Styling with dark/light mode support
- **Local Storage**: All data persisted in browser localStorage for privacy

### Backend (Python Flask)
- **backend_server.py**: Flask server providing API endpoints and serving static files
- **start_dashboard.py**: Setup script with environment checking and installation
- Integration modules for various APIs:
  - **scrape_creators_integration.py**: Social media monitoring (TikTok, YouTube, Reddit)
  - **exa_search_integration.py**: Web-wide mention tracking
  - **google_analytics_integration.py**: GA4 integration for traffic data

### Configuration
- **config.env.example**: Template for environment variables
- **.env**: Local environment configuration (not committed)
- **requirements.txt**: Python dependencies

## Development Commands

### Start the Dashboard
```bash
# Quick start (includes setup and dependency installation)
python3 start_dashboard.py

# Or directly start the backend server
python3 backend_server.py

# Access the dashboard at http://localhost:8080
```

### Testing
```bash
# Test the complete setup and API integrations
python3 example_usage.py      # Example usage and integration testing
```

### Dependencies
```bash
# Install Python dependencies
pip install -r requirements.txt
```

## Environment Setup

1. Copy configuration template: `cp config.env.example .env`
2. Edit `.env` with your API keys:
   - `BRAND_NAME`: Your brand name for monitoring
   - `SCRAPE_CREATORS_API_KEY`: For social media monitoring
   - `EXA_API_KEY`: For web mention tracking
   - `GA4_PROPERTY_ID` and `GA4_CREDENTIALS_PATH`: For Google Analytics

## Key Components

### Dashboard State Management
The frontend uses a centralized state object (`dashboardState` in app.js:2) containing:
- **signals**: Real-time metrics (branded search, direct traffic, mentions)
- **campaigns**: Campaign performance tracking
- **echoes**: Manual mention logging
- **apiKeys**: API credentials (stored locally)

### API Integration Pattern
Each integration follows a consistent pattern:
1. Environment variable configuration in `.env`
2. Python class in dedicated integration file (`*_integration.py`)
3. Conditional initialization in `backend_server.py:84-110` with graceful fallbacks
4. API endpoint exposure through Flask routes at `/api/*`

### Available Integrations
- **ScrapeCreators**: Social media monitoring (TikTok, YouTube, Reddit)
- **Exa Search**: Web-wide mention tracking and search
- **Google Analytics**: GA4 integration for traffic data (optional dependency)
- **OpenRouter Sentiment**: AI-powered sentiment analysis (optional dependency)

### Data Flow
1. Frontend makes requests to Flask backend at `/api/*` endpoints
2. Backend integrations fetch data from external APIs
3. Data cached in `data_cache/` directory with JSON files
4. Results returned to frontend and stored in localStorage
5. Graceful degradation when APIs are unavailable or misconfigured

### Error Handling
- All integrations have conditional initialization with try/catch blocks
- Missing optional dependencies log warnings but don't break the application
- API failures are logged and return empty/fallback data
- Frontend operates in demo mode when backend APIs are unavailable

## File Structure Highlights

- **Frontend**: Single-page application with no build process required
- **Backend**: Flask server with modular API integrations
- **Cache**: JSON-based caching in `data_cache/` directory
- **Tests**: Individual API test scripts for debugging integrations
- **Docs**: Comprehensive markdown documentation for setup and troubleshooting

## Development Notes

- Dashboard runs entirely client-side for privacy (frontend-only mode)
- Backend optional for real API data integration
- No database required - uses file-based caching and localStorage
- Mobile-responsive design with system dark/light mode support
- All API keys stored locally, never transmitted to external servers