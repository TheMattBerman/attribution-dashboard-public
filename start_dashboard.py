#!/usr/bin/env python3
"""
Attribution Dashboard Startup Script
Helps set up environment and start the dashboard
"""

import os
import sys
import subprocess
import shutil

def check_python_version():
    """Check if Python version is 3.7+"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_pip():
    """Check if pip is available"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], 
                      capture_output=True, check=True)
        print("✅ pip is available")
        return True
    except subprocess.CalledProcessError:
        print("❌ pip is not available")
        return False

def install_requirements():
    """Install required packages"""
    print("\n📦 Installing required packages...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True)
        print("✅ All packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        print("\n📄 Creating .env file...")
        try:
            shutil.copy('config.env.example', '.env')
            print("✅ .env file created from example")
            print("📝 Please edit .env file and add your API keys")
            return True
        except FileNotFoundError:
            print("❌ config.env.example not found")
            return False
    else:
        print("✅ .env file already exists")
        return True

def check_api_keys():
    """Check if API keys are configured"""
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        scrape_creators_key = os.getenv('SCRAPE_CREATORS_API_KEY', '')
        exa_key = os.getenv('EXA_API_KEY', '')
        brand_name = os.getenv('BRAND_NAME', 'YourBrandName')
        
        print(f"\n🏷️  Brand Name: {brand_name}")
        print(f"🔑 ScrapeCreators API: {'✅ Configured' if scrape_creators_key else '⚠️  Not configured'}")
        print(f"🔑 Exa Search API: {'✅ Configured' if exa_key else '⚠️  Not configured'}")
        
        if not scrape_creators_key and not exa_key:
            print("\n⚠️  No API keys configured. The dashboard will run in demo mode.")
            print("   Add your API keys to .env file for real data.")
        
        return True
    except ImportError:
        print("❌ python-dotenv not installed")
        return False

def start_server():
    """Start the backend server"""
    print("\n🚀 Starting Attribution Dashboard...")
    print("   Frontend: http://localhost:8080")
    print("   Backend API: http://localhost:8080/api")
    print("\n   Press Ctrl+C to stop the server")
    
    try:
        subprocess.run([sys.executable, "backend_server.py"])
    except KeyboardInterrupt:
        print("\n👋 Dashboard stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    print("🎯 Attribution Dashboard Setup")
    print("=" * 40)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_pip():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Create .env file
    if not create_env_file():
        sys.exit(1)
    
    # Check API keys
    if not check_api_keys():
        sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 