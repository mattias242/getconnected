const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('../models/database');
const RecommendationEngine = require('../services/recommendationEngine');
const Scheduler = require('../services/scheduler');
const { getAllPlatforms } = require('../models/platforms');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database and services
const db = new Database();
const engine = new RecommendationEngine(db);
const scheduler = new Scheduler(db);

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = await db.addUser(name, email);
    res.json({ id: userId, message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user preferences
app.get('/api/users/:userId/preferences', async (req, res) => {
  try {
    const preferences = await db.getUserPreferences(req.params.userId);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add user preference
app.post('/api/users/:userId/preferences', async (req, res) => {
  try {
    const { platform, preferenceLevel, hasAccount, notes } = req.body;
    const id = await db.addUserPreference(
      req.params.userId,
      platform,
      preferenceLevel,
      hasAccount,
      notes
    );
    res.json({ id, message: 'Preference added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all platforms
app.get('/api/platforms', (req, res) => {
  try {
    const platforms = getAllPlatforms();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find common platforms
app.post('/api/analyze', async (req, res) => {
  try {
    const { userIds, requiredFeatures = [] } = req.body;
    
    // Create temporary group
    const groupId = await db.createGroup(`temp_group_${Date.now()}`);
    
    // Add users to group
    for (const userId of userIds) {
      await db.addUserToGroup(groupId, userId);
    }
    
    // Get analysis
    const commonPlatforms = await engine.findCommonPlatforms(groupId);
    const recommendations = await engine.recommendPlatforms(groupId, requiredFeatures);
    
    res.json({
      commonPlatforms,
      recommendations,
      groupId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule meeting
app.post('/api/schedule', async (req, res) => {
  try {
    const { groupId, platform, datetime, duration, notes } = req.body;
    
    const scheduleId = await scheduler.scheduleGroupChat(
      groupId,
      platform,
      datetime,
      duration,
      notes
    );
    
    // Save group decision
    await db.saveGroupDecision(groupId, platform, 'Scheduled via web interface');
    
    // Generate meeting link
    const meetingLink = scheduler.generateMeetingLink(platform, `Group ${groupId}`);
    
    res.json({
      scheduleId,
      meetingLink,
      message: 'Meeting scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data
app.post('/api/export', async (req, res) => {
  try {
    const { userIds, format = 'json' } = req.body;
    
    // Create temporary group
    const groupId = await db.createGroup(`temp_export_${Date.now()}`);
    
    // Add users to group
    for (const userId of userIds) {
      await db.addUserToGroup(groupId, userId);
    }
    
    const members = await db.getGroupMembers(groupId);
    const commonPlatforms = await engine.findCommonPlatforms(groupId);
    const recommendations = await engine.recommendPlatforms(groupId);
    
    const exportData = {
      timestamp: new Date().toISOString(),
      group: {
        id: groupId,
        members: members.map(m => ({ name: m.name, email: m.email }))
      },
      analysis: commonPlatforms.analysis,
      commonPlatforms: commonPlatforms.commonPlatforms,
      recommendations: recommendations.recommendations,
      recommendationReason: recommendations.reason
    };
    
    if (format === 'json') {
      res.json(exportData);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="group-analysis.csv"');
      
      let csv = 'Platform,Score,Average Preference,Privacy Score,Popularity Score\n';
      recommendations.recommendations.forEach(rec => {
        csv += `${rec.name},${rec.recommendationScore},${rec.averagePreference},${rec.privacyScore},${rec.popularityScore}\n`;
      });
      
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`GetConnected web interface running on http://localhost:${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

module.exports = app;