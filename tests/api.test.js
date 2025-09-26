const request = require('supertest');
const app = require('../src/server');

describe('Perplexity Search API', () => {
  
  describe('Health Endpoints', () => {
    test('GET /health should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
    });

    test('GET /api/v1/search/stats should return server statistics', async () => {
      const response = await request(app)
        .get('/api/v1/search/stats')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toHaveProperty('server_uptime');
      expect(response.body.stats).toHaveProperty('memory_usage');
      expect(response.body.stats).toHaveProperty('node_version');
      expect(response.body.stats).toHaveProperty('api_version');
    });
  });

  describe('Search Validation', () => {
    test('POST /api/v1/search should require query parameter', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'Validation failed');
      expect(response.body.error).toHaveProperty('details');
    });

    test('POST /api/v1/search should validate query length', async () => {
      const longQuery = 'a'.repeat(1001); // Exceeds 1000 character limit
      
      const response = await request(app)
        .post('/api/v1/search')
        .send({ query: longQuery })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('POST /api/v1/search should validate model parameter', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ 
          query: 'test query',
          model: 'invalid-model'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('POST /api/v1/search should validate temperature range', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ 
          query: 'test query',
          temperature: 3.0 // Exceeds maximum of 2.0
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/v1/search should validate max_tokens range', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ 
          query: 'test query',
          max_tokens: 5000 // Exceeds maximum of 4000
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('404 Handler', () => {
    test('Should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message', 'The requested resource was not found');
      expect(response.body).toHaveProperty('path', '/non-existent-route');
    });
  });

  describe('Rate Limiting', () => {
    test('Should accept requests within rate limit', async () => {
      // Make a few requests to ensure rate limiting is working
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .get('/health')
          .expect(200);
        
        expect(response.body).toHaveProperty('status', 'OK');
      }
    });
  });
});