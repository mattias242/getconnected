// API endpoint tests
const request = require('supertest');
const app = require('../api/index.js');

describe('API Endpoints', () => {
  
  describe('GET /api/health', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment', 'serverless');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('platforms', 7);
    });
  });

  describe('GET /api/platforms', () => {
    test('should return all messaging platforms', async () => {
      const response = await request(app)
        .get('/api/platforms')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(7);
      
      // Check that each platform has required properties
      response.body.forEach(platform => {
        expect(platform).toHaveProperty('key');
        expect(platform).toHaveProperty('name');
        expect(platform).toHaveProperty('features');
        expect(platform).toHaveProperty('privacyScore');
        expect(platform).toHaveProperty('popularityScore');
        expect(platform).toHaveProperty('freeToUse');
      });
      
      // Check for specific platforms
      const platformNames = response.body.map(p => p.name);
      expect(platformNames).toContain('WhatsApp');
      expect(platformNames).toContain('Telegram');
      expect(platformNames).toContain('Signal');
      expect(platformNames).toContain('Discord');
    });
  });

  describe('User Management', () => {
    test('GET /api/users should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/users should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message', 'User added successfully');
    });

    test('POST /api/users should reject duplicate users', async () => {
      const newUser = {
        name: 'Duplicate User',
        email: 'duplicate@example.com'
      };
      
      // Create user first time
      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);
      
      // Try to create same user again
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'User already exists');
    });

    test('POST /api/users should require name', async () => {
      const invalidUser = {
        email: 'noemail@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('User Preferences', () => {
    let userId;
    
    beforeEach(async () => {
      // Create a user for preference tests with unique name
      const uniqueName = `Preference Test User ${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({ name: uniqueName, email: `pref_${Date.now()}@example.com` });
      
      userId = userResponse.body.id;
    });

    test('GET /api/users/:userId/preferences should return empty array initially', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}/preferences`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('POST /api/users/:userId/preferences should add preference', async () => {
      const preference = {
        platform: 'whatsapp',
        preferenceLevel: 9,
        hasAccount: true,
        notes: 'Daily use'
      };
      
      const response = await request(app)
        .post(`/api/users/${userId}/preferences`)
        .send(preference)
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message', 'Preference added successfully');
    });

    test('POST /api/users/:userId/preferences should update existing preference', async () => {
      const preference1 = {
        platform: 'telegram',
        preferenceLevel: 7,
        hasAccount: true,
        notes: 'Good features'
      };
      
      const preference2 = {
        platform: 'telegram',
        preferenceLevel: 8,
        hasAccount: true,
        notes: 'Updated preference'
      };
      
      // Add first preference
      await request(app)
        .post(`/api/users/${userId}/preferences`)
        .send(preference1)
        .expect(200);
      
      // Update same platform preference
      await request(app)
        .post(`/api/users/${userId}/preferences`)
        .send(preference2)
        .expect(200);
      
      // Get preferences and verify update
      const response = await request(app)
        .get(`/api/users/${userId}/preferences`)
        .expect(200);
      
      expect(response.body.length).toBe(1);
      expect(response.body[0].preference_level).toBe(8);
      expect(response.body[0].notes).toBe('Updated preference');
    });
  });

  describe('Group Analysis', () => {
    test('POST /api/analyze should handle empty userIds', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ userIds: [] })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'No users provided');
    });

    test('POST /api/analyze should handle missing userIds', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'No users provided');
    });

    test('POST /api/analyze should return analysis for users without preferences', async () => {
      // Create a user without preferences
      const uniqueName = `Analysis Test User ${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({ name: uniqueName, email: `analysis_${Date.now()}@example.com` });
      
      const userId = userResponse.body.id;
      
      const response = await request(app)
        .post('/api/analyze')
        .send({ userIds: [userId], requiredFeatures: [] })
        .expect(200);
      
      expect(response.body).toHaveProperty('commonPlatforms');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body).toHaveProperty('groupId');
      
      // Should return no common platforms for user without preferences
      expect(response.body.commonPlatforms.commonPlatforms).toHaveLength(0);
      expect(response.body.recommendations.recommendations).toHaveLength(0);
    });
  });

  describe('Export Data', () => {
    test('POST /api/export should handle empty userIds', async () => {
      const response = await request(app)
        .post('/api/export')
        .send({ userIds: [] })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'No users provided');
    });

    test('POST /api/export should return JSON format by default', async () => {
      // Create a user for export test
      const uniqueName = `Export Test User ${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({ name: uniqueName, email: `export_${Date.now()}@example.com` });
      
      const userId = userResponse.body.id;
      
      const response = await request(app)
        .post('/api/export')
        .send({ userIds: [userId] })
        .expect(200);
      
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('group');
      expect(response.body).toHaveProperty('analysis');
      expect(response.body).toHaveProperty('commonPlatforms');
      expect(response.body).toHaveProperty('recommendations');
    });

    test('POST /api/export should return CSV format when requested', async () => {
      // Create a user for export test
      const uniqueName = `CSV Export Test User ${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({ name: uniqueName, email: `csvexport_${Date.now()}@example.com` });
      
      const userId = userResponse.body.id;
      
      const response = await request(app)
        .post('/api/export')
        .send({ userIds: [userId], format: 'csv' })
        .expect(200);
      
      expect(response.text).toContain('Platform,Score,Average Preference,Privacy Score,Popularity Score');
    });
  });

  describe('Static Pages', () => {
    test('GET / should return HTML page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('GetConnected');
      expect(response.text).toContain('Find the perfect messaging platform for your group');
    });
  });
});