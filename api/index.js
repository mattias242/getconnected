// Serverless-compatible version of the web server for Vercel
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Embedded platform data for serverless environment
const messagingPlatforms = {
  whatsapp: {
    name: 'WhatsApp',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: false,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 1024,
      businessFeatures: false,
      integrations: false,
      threading: false,
      customEmojis: false,
      bots: false
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Web'],
    privacyScore: 7,
    popularityScore: 10,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: true
  },
  telegram: {
    name: 'Telegram',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: false,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 200000,
      businessFeatures: false,
      integrations: true,
      threading: false,
      customEmojis: true,
      bots: true
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Web'],
    privacyScore: 8,
    popularityScore: 8,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: true
  },
  signal: {
    name: 'Signal',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: false,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: false,
      maxGroupSize: 1000,
      businessFeatures: false,
      integrations: false,
      threading: false,
      customEmojis: false,
      bots: false
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux'],
    privacyScore: 10,
    popularityScore: 6,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: true
  },
  discord: {
    name: 'Discord',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: true,
      endToEndEncryption: false,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 500000,
      businessFeatures: false,
      integrations: true,
      threading: true,
      customEmojis: true,
      bots: true
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Web'],
    privacyScore: 5,
    popularityScore: 9,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: false
  },
  slack: {
    name: 'Slack',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: true,
      endToEndEncryption: false,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 500000,
      businessFeatures: true,
      integrations: true,
      threading: true,
      customEmojis: true,
      bots: true
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Web'],
    privacyScore: 6,
    popularityScore: 7,
    businessFriendly: true,
    freeToUse: false,
    requiresPhoneNumber: false
  },
  messenger: {
    name: 'Facebook Messenger',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: false,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 250,
      businessFeatures: false,
      integrations: false,
      threading: false,
      customEmojis: true,
      bots: false
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Web'],
    privacyScore: 4,
    popularityScore: 9,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: false
  },
  teams: {
    name: 'Microsoft Teams',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: true,
      endToEndEncryption: false,
      desktopApp: true,
      webApp: true,
      maxGroupSize: 250,
      businessFeatures: true,
      integrations: true,
      threading: true,
      customEmojis: false,
      bots: true
    },
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Web'],
    privacyScore: 6,
    popularityScore: 8,
    businessFriendly: true,
    freeToUse: false,
    requiresPhoneNumber: false
  }
};

const getAllPlatforms = () => {
  return Object.keys(messagingPlatforms).map(key => ({
    key,
    ...messagingPlatforms[key]
  }));
};

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
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>GetConnected</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; border-radius: 10px; margin-bottom: 2rem; }
        .section { background: #f8f9fa; padding: 2rem; margin: 1rem 0; border-radius: 10px; border: 1px solid #e9ecef; }
        .btn { background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px; }
        .btn:hover { background: #5a67d8; }
        .endpoint { background: #fff; padding: 1rem; margin: 0.5rem 0; border-radius: 5px; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 GetConnected</h1>
            <p>Cross-platform messaging app preference matcher</p>
        </div>
        
        <div class="section">
            <h2>📡 API Endpoints</h2>
            <div class="endpoint">
                <strong>GET /api/platforms</strong> - List all messaging platforms
                <br><a href="/api/platforms" class="btn">Try it</a>
            </div>
            <div class="endpoint">
                <strong>GET /api/health</strong> - Health check
                <br><a href="/api/health" class="btn">Try it</a>
            </div>
            <div class="endpoint">
                <strong>GET /api/users</strong> - List all users
                <br><a href="/api/users" class="btn">Try it</a>
            </div>
        </div>

        <div class="section">
            <h2>✨ Features</h2>
            <ul>
                <li>🔍 Analyze group messaging preferences</li>
                <li>🎯 Get intelligent platform recommendations</li>
                <li>👥 Manage users and their preferences</li>
                <li>📊 Export analysis data</li>
                <li>📅 Schedule group meetings</li>
            </ul>
        </div>

        <div class="section">
            <h2>🌟 About</h2>
            <p>GetConnected helps groups find their messaging app common denominators and facilitates group communication across 8 major platforms including WhatsApp, Telegram, Signal, Discord, Slack, and more.</p>
            <p><strong>Note:</strong> This is the serverless demo version. For full CLI functionality, clone the repository and run locally.</p>
            <p><a href="https://github.com/mattias242/getconnected" class="btn">View on GitHub</a></p>
        </div>
    </div>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'serverless',
    version: '1.0.0',
    platforms: Object.keys(messagingPlatforms).length
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;