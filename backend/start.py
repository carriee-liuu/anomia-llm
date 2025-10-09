#!/usr/bin/env python3
"""
Startup script for Anomia LLM Python Backend
"""

import uvicorn
import os
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment
    port = int(os.getenv("PORT", 3001))  # Railway sets PORT automatically
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "false").lower() == "true"  # Default to false for production
    
    print("🚀 Starting Anomia LLM Python Backend...")
    print(f"📡 Server: {host}:{port}")
    print(f"🔧 Debug: {debug}")
    print(f"🌐 Frontend URL: {os.getenv('FRONTEND_URL', 'http://localhost:3000')}")
    print("=" * 50)
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "warning"
    )

if __name__ == "__main__":
    main() 