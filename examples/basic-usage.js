const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Basic search example
 */
async function basicSearch() {
  try {
    console.log('🔍 Performing basic search...');
    
    const response = await axios.post(`${API_BASE_URL}/search`, {
      query: 'What are the latest developments in artificial intelligence?'
    });
    
    console.log('✅ Search Result:');
    console.log('Query:', response.data.query);
    console.log('Response:', response.data.response.substring(0, 200) + '...');
    console.log('Citations:', response.data.citations.length);
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ Basic search failed:', error.response?.data || error.message);
  }
}

/**
 * Advanced search with custom parameters
 */
async function advancedSearch() {
  try {
    console.log('🚀 Performing advanced search...');
    
    const response = await axios.post(`${API_BASE_URL}/search`, {
      query: 'Explain quantum computing and its potential applications',
      model: 'llama-3.1-sonar-large-128k-online',
      max_tokens: 1500,
      temperature: 0.1,
      return_citations: true,
      return_images: true,
      recency_filter: 'week'
    });
    
    console.log('✅ Advanced Search Result:');
    console.log('Model Used:', response.data.model_used);
    console.log('Response Length:', response.data.response.length);
    console.log('Citations:', response.data.citations.length);
    console.log('Images:', response.data.images.length);
    console.log('Usage:', response.data.usage);
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ Advanced search failed:', error.response?.data || error.message);
  }
}

/**
 * Get available models
 */
async function getModels() {
  try {
    console.log('📋 Fetching available models...');
    
    const response = await axios.get(`${API_BASE_URL}/search/models`);
    
    console.log('✅ Available Models:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ Failed to fetch models:', error.response?.data || error.message);
  }
}

/**
 * Check API health
 */
async function checkHealth() {
  try {
    console.log('🏥 Checking API health...');
    
    const response = await axios.get(`${API_BASE_URL}/search/health`);
    
    console.log('✅ Health Status:');
    console.log('Perplexity API:', response.data.perplexity_api.status);
    console.log('API URL:', response.data.perplexity_api.url);
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
  }
}

/**
 * Multiple searches with different parameters
 */
async function multipleSearches() {
  const queries = [
    {
      query: 'Latest trends in web development 2024',
      recency_filter: 'month'
    },
    {
      query: 'How does machine learning work?',
      temperature: 0.3,
      max_tokens: 800
    },
    {
      query: 'Best practices for API security',
      model: 'llama-3.1-sonar-small-128k-online',
      return_citations: true
    }
  ];

  console.log('🔄 Performing multiple searches...');
  
  for (let i = 0; i < queries.length; i++) {
    try {
      console.log(`\n📝 Search ${i + 1}: ${queries[i].query}`);
      
      const response = await axios.post(`${API_BASE_URL}/search`, queries[i]);
      
      console.log('✅ Success');
      console.log('Response length:', response.data.response.length);
      console.log('Citations:', response.data.citations.length);
      
    } catch (error) {
      console.error(`❌ Search ${i + 1} failed:`, error.response?.data || error.message);
    }
    
    // Add delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('---\n');
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('🎯 Perplexity Search API Examples\n');
  console.log('================================\n');
  
  await checkHealth();
  await getModels();
  await basicSearch();
  await advancedSearch();
  await multipleSearches();
  
  console.log('✨ All examples completed!');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicSearch,
  advancedSearch,
  getModels,
  checkHealth,
  multipleSearches,
  runExamples
};