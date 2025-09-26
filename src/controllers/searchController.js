const perplexityService = require('../services/perplexityService');
const logger = require('../config/logger');

class SearchController {
  /**
   * Perform a search query
   */
  async search(req, res, next) {
    try {
      const { query, ...options } = req.validatedData;
      
      logger.info(`Search request received: ${query}`);
      
      const result = await perplexityService.search(query, options);
      
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        ...result.data
      });
      
    } catch (error) {
      logger.error('Search controller error:', error.message);
      next(error);
    }
  }

  /**
   * Get available search models
   */
  async getModels(req, res, next) {
    try {
      logger.info('Models request received');
      
      const result = await perplexityService.getModels();
      
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        ...result.data
      });
      
    } catch (error) {
      logger.error('Get models controller error:', error.message);
      next(error);
    }
  }

  /**
   * Check API health and connectivity
   */
  async checkHealth(req, res, next) {
    try {
      logger.info('Health check request received');
      
      const isConnected = await perplexityService.validateConnection();
      
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        perplexity_api: {
          status: isConnected ? 'connected' : 'disconnected',
          url: process.env.PERPLEXITY_API_URL || 'https://api.perplexity.ai'
        }
      });
      
    } catch (error) {
      logger.error('Health check controller error:', error.message);
      next(error);
    }
  }

  /**
   * Get search statistics and usage
   */
  async getStats(req, res, next) {
    try {
      logger.info('Stats request received');
      
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        stats: {
          server_uptime: process.uptime(),
          memory_usage: process.memoryUsage(),
          node_version: process.version,
          api_version: process.env.API_VERSION || 'v1'
        }
      });
      
    } catch (error) {
      logger.error('Stats controller error:', error.message);
      next(error);
    }
  }
}

module.exports = new SearchController();