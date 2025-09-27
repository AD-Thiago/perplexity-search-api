const axios = require('axios');
const logger = require('../config/logger');

class PerplexityService {
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    this.baseURL = process.env.PERPLEXITY_API_URL || 'https://api.perplexity.ai';
    
    if (!this.apiKey) {
      logger.error('PERPLEXITY_API_KEY is not set in environment variables');
      throw new Error('Perplexity API key is required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds
    });
  }

  /**
   * Perform a search using Perplexity AI
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async search(query, options = {}) {
    try {
      const {
        model = 'llama-3.1-sonar-small-128k-online',
        max_tokens = 1000,
        temperature = 0.2,
        top_p = 0.9,
        return_citations = true,
        return_images = false,
        recency_filter = 'month'
      } = options;

      logger.info(`Performing search with query: ${query}`);

      const response = await this.client.post('/chat/completions', {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate and well-researched information. Always cite your sources.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens,
        temperature,
        top_p,
        return_citations,
        return_images,
        recency_filter
      });

      logger.info('Search completed successfully');
      
      return {
        success: true,
        data: {
          query,
          response: response.data.choices[0].message.content,
          citations: response.data.citations || [],
          images: response.data.images || [],
          model_used: model,
          usage: response.data.usage || {}
        }
      };

    } catch (error) {
      logger.error('Error performing search:', error.message);
      
      if (error.response) {
        throw new Error(`Perplexity API error: ${error.response.status} - ${error.response.data.error || error.response.statusText}`);
      }
      
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get available models
   * @returns {Promise<Object>} Available models
   */
  async getModels() {
    try {
      const response = await this.client.get('/models');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      logger.error('Error fetching models:', error.message);
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }

  /**
   * Validate API connection
   * @returns {Promise<boolean>} Connection status
   */
  async validateConnection() {
    try {
      await this.getModels();
      return true;
    } catch (error) {
      logger.error('API connection validation failed:', error.message);
      return false;
    }
  }
}

module.exports = new PerplexityService();