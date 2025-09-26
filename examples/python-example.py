import requests
import json
import time

# Configuration
API_BASE_URL = 'http://localhost:3000/api/v1'

def basic_search_example():
    """Basic search example"""
    print("🔍 Performing basic search...")
    
    url = f"{API_BASE_URL}/search"
    data = {
        "query": "What are the latest developments in artificial intelligence?"
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ Search successful!")
            print(f"Query: {result['query']}")
            print(f"Response: {result['response'][:200]}...")
            print(f"Citations: {len(result['citations'])}")
        else:
            print(f"❌ Error: {result}")
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print("-" * 50)

def advanced_search_example():
    """Advanced search with custom parameters"""
    print("🚀 Performing advanced search...")
    
    url = f"{API_BASE_URL}/search"
    data = {
        "query": "Explain quantum computing and its potential applications",
        "model": "llama-3.1-sonar-large-128k-online",
        "max_tokens": 1500,
        "temperature": 0.1,
        "return_citations": True,
        "return_images": True,
        "recency_filter": "week"
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ Advanced search successful!")
            print(f"Model: {result['model_used']}")
            print(f"Response length: {len(result['response'])}")
            print(f"Citations: {len(result['citations'])}")
            print(f"Images: {len(result['images'])}")
            print(f"Usage: {result['usage']}")
        else:
            print(f"❌ Error: {result}")
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print("-" * 50)

def get_models_example():
    """Get available models"""
    print("📋 Fetching available models...")
    
    url = f"{API_BASE_URL}/search/models"
    
    try:
        response = requests.get(url)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ Models fetched successfully!")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {result}")
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print("-" * 50)

def health_check_example():
    """Check API health"""
    print("🏥 Checking API health...")
    
    url = f"{API_BASE_URL}/search/health"
    
    try:
        response = requests.get(url)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ API is healthy!")
            print(f"Perplexity API: {result['perplexity_api']['status']}")
            print(f"API URL: {result['perplexity_api']['url']}")
        else:
            print(f"❌ Error: {result}")
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print("-" * 50)

def multiple_searches_example():
    """Perform multiple searches with different parameters"""
    queries = [
        {
            "query": "Latest trends in web development 2024",
            "recency_filter": "month"
        },
        {
            "query": "How does machine learning work?",
            "temperature": 0.3,
            "max_tokens": 800
        },
        {
            "query": "Best practices for API security",
            "model": "llama-3.1-sonar-small-128k-online",
            "return_citations": True
        }
    ]
    
    print("🔄 Performing multiple searches...")
    
    for i, query_data in enumerate(queries, 1):
        print(f"\n📝 Search {i}: {query_data['query']}")
        
        try:
            response = requests.post(f"{API_BASE_URL}/search", json=query_data)
            result = response.json()
            
            if response.status_code == 200:
                print("✅ Success")
                print(f"Response length: {len(result['response'])}")
                print(f"Citations: {len(result['citations'])}")
            else:
                print(f"❌ Error: {result}")
        except Exception as e:
            print(f"❌ Request failed: {e}")
        
        # Add delay between requests
        time.sleep(1)
    
    print("-" * 50)

def run_all_examples():
    """Run all examples"""
    print("🎯 Perplexity Search API Python Examples")
    print("=" * 50)
    
    health_check_example()
    get_models_example()
    basic_search_example()
    advanced_search_example()
    multiple_searches_example()
    
    print("✨ All examples completed!")

if __name__ == "__main__":
    run_all_examples()