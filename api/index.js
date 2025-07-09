// Serverless-compatible version of the web server for Vercel
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import our components
const { getAllPlatforms } = require('../models/platforms');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for serverless environment
let users = [];
let groups = [];
let preferences = [];
let schedules = [];
let decisions = [];

// Simple ID generator
let nextId = 1;
const generateId = () => nextId++;

// API Routes for serverless environment

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Add user
app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.name === name);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = {
      id: generateId(),
      name,
      email: email || null,
      created_at: new Date().toISOString()
    };
    
    users.push(user);
    res.json({ id: user.id, message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user preferences
app.get('/api/users/:userId/preferences', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userPrefs = preferences.filter(p => p.user_id === userId);
    res.json(userPrefs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add user preference
app.post('/api/users/:userId/preferences', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { platform, preferenceLevel, hasAccount, notes } = req.body;
    
    // Remove existing preference for this platform
    preferences = preferences.filter(p => !(p.user_id === userId && p.platform === platform));
    
    const preference = {
      id: generateId(),
      user_id: userId,
      platform,
      preference_level: preferenceLevel || 5,
      has_account: hasAccount !== undefined ? hasAccount : true,
      notes: notes || null
    };
    
    preferences.push(preference);
    res.json({ id: preference.id, message: 'Preference added successfully' });
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

// Simple recommendation engine for serverless
function findCommonPlatforms(userIds) {
  const platformData = {};
  
  userIds.forEach(userId => {
    const userPrefs = preferences.filter(p => p.user_id === userId);
    userPrefs.forEach(pref => {
      if (pref.has_account) {
        if (!platformData[pref.platform]) {
          platformData[pref.platform] = {
            users: [],
            totalPreference: 0,
            hasAccountCount: 0
          };
        }
        
        platformData[pref.platform].users.push({
          userId: pref.user_id,
          preferenceLevel: pref.preference_level
        });
        platformData[pref.platform].totalPreference += pref.preference_level;
        platformData[pref.platform].hasAccountCount++;
      }
    });
  });
  
  const commonPlatforms = [];
  const allPlatforms = getAllPlatforms();
  
  Object.keys(platformData).forEach(platformKey => {
    const data = platformData[platformKey];
    if (data.hasAccountCount === userIds.length) {
      const platform = allPlatforms.find(p => p.key === platformKey);
      if (platform) {
        commonPlatforms.push({
          ...platform,
          averagePreference: data.totalPreference / userIds.length,
          allHaveAccounts: true
        });
      }
    }
  });
  
  commonPlatforms.sort((a, b) => b.averagePreference - a.averagePreference);
  
  return commonPlatforms;
}

function calculateRecommendationScore(platform, requiredFeatures = []) {
  let score = 0;
  
  // Base score from user preferences
  score += platform.averagePreference * 2;
  
  // Platform quality scores
  score += platform.popularityScore * 0.5;
  score += platform.privacyScore * 0.3;
  
  // Feature matching bonus
  const featureBonus = requiredFeatures.filter(feature => 
    platform.features[feature]
  ).length * 3;
  score += featureBonus;
  
  // Penalty for missing required features
  const missingFeatures = requiredFeatures.filter(feature => 
    !platform.features[feature]
  ).length;
  score -= missingFeatures * 5;
  
  // Free platform bonus
  if (platform.freeToUse) {
    score += 2;
  }
  
  return Math.round(score * 10) / 10;
}

// Analyze group
app.post('/api/analyze', (req, res) => {
  try {
    const { userIds, requiredFeatures = [] } = req.body;
    
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ error: 'No users provided' });
    }
    
    const commonPlatforms = findCommonPlatforms(userIds);
    
    const recommendations = commonPlatforms.map(platform => {
      const featureMatch = requiredFeatures.length === 0 || 
        requiredFeatures.every(feature => platform.features[feature]);
      
      const score = calculateRecommendationScore(platform, requiredFeatures);
      
      return {
        ...platform,
        featureMatch,
        recommendationScore: score,
        missingFeatures: requiredFeatures.filter(feature => !platform.features[feature])
      };
    });
    
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    const analysis = commonPlatforms.length === 0 ? 
      `No platforms found where all ${userIds.length} users have accounts` :
      `Found ${commonPlatforms.length} platform(s) where all ${userIds.length} users have accounts. Top choice: ${commonPlatforms[0].name}`;
    
    const reason = recommendations.length > 0 ? 
      `${recommendations[0].name} is recommended based on user preferences and feature match` :
      'No suitable platforms found';
    
    res.json({
      commonPlatforms: {
        commonPlatforms,
        analysis
      },
      recommendations: {
        recommendations,
        reason
      },
      groupId: generateId()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule meeting
app.post('/api/schedule', (req, res) => {
  try {
    const { groupId, platform, datetime, duration = 60, notes } = req.body;
    
    const schedule = {
      id: generateId(),
      group_id: groupId,
      platform,
      scheduled_datetime: datetime,
      duration_minutes: duration,
      notes: notes || null,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };
    
    schedules.push(schedule);
    
    const decision = {
      id: generateId(),
      group_id: groupId,
      chosen_platform: platform,
      decision_reason: 'Scheduled via web interface',
      decided_at: new Date().toISOString()
    };
    
    decisions.push(decision);
    
    // Generate meeting link
    const meetingLink = `https://meeting.${platform}.com/join/group-${groupId}`;
    
    res.json({
      scheduleId: schedule.id,
      meetingLink,
      message: 'Meeting scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data
app.post('/api/export', (req, res) => {
  try {
    const { userIds, format = 'json' } = req.body;
    
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ error: 'No users provided' });
    }
    
    const selectedUsers = users.filter(u => userIds.includes(u.id));
    const commonPlatforms = findCommonPlatforms(userIds);
    
    const recommendations = commonPlatforms.map(platform => ({
      ...platform,
      recommendationScore: calculateRecommendationScore(platform)
    }));
    
    const exportData = {
      timestamp: new Date().toISOString(),
      group: {
        members: selectedUsers.map(u => ({ name: u.name, email: u.email }))
      },
      analysis: `Found ${commonPlatforms.length} common platforms`,
      commonPlatforms,
      recommendations,
      recommendationReason: recommendations.length > 0 ? 
        `${recommendations[0].name} is the top recommendation` : 
        'No recommendations available'
    };
    
    if (format === 'json') {
      res.json(exportData);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="group-analysis.csv"');
      
      let csv = 'Platform,Score,Average Preference,Privacy Score,Popularity Score\n';
      recommendations.forEach(rec => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;