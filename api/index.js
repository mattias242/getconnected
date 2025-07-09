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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
      android: 'https://play.google.com/store/apps/details?id=com.whatsapp'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/telegram-messenger/id686449807',
      android: 'https://play.google.com/store/apps/details?id=org.telegram.messenger'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/signal-private-messenger/id874139669',
      android: 'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/discord/id985746746',
      android: 'https://play.google.com/store/apps/details?id=com.discord'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/slack/id618783545',
      android: 'https://play.google.com/store/apps/details?id=com.Slack'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/messenger/id454638411',
      android: 'https://play.google.com/store/apps/details?id=com.facebook.orca'
    },
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
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/microsoft-teams/id1113153706',
      android: 'https://play.google.com/store/apps/details?id=com.microsoft.teams'
    },
    privacyScore: 6,
    popularityScore: 8,
    businessFriendly: true,
    freeToUse: false,
    requiresPhoneNumber: false
  },
  imessage: {
    name: 'iMessage',
    features: {
      textMessages: true,
      voiceCalls: true,
      videoCalls: true,
      groupChats: true,
      fileSharing: true,
      screenSharing: true,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: false,
      maxGroupSize: 32,
      businessFeatures: false,
      integrations: false,
      threading: false,
      customEmojis: true,
      bots: false
    },
    platforms: ['iOS', 'macOS'],
    appStoreLinks: {
      ios: 'https://apps.apple.com/app/messages/id1146560473',
      android: null
    },
    privacyScore: 9,
    popularityScore: 8,
    businessFriendly: false,
    freeToUse: true,
    requiresPhoneNumber: true
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
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.name === name);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = {
      id: generateId(),
      name: name.trim(),
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

// Serve main HTML page with full interactive interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GetConnected - Group Messaging Coordinator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem 0; text-align: center; margin-bottom: 2rem; border-radius: 10px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .section { background: white; padding: 2rem; margin: 1rem 0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section h2 { color: #667eea; margin-bottom: 1rem; font-size: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        input, select, textarea { width: 100%; padding: 0.75rem; border: 2px solid #e1e1e1; border-radius: 5px; font-size: 1rem; transition: border-color 0.3s; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #667eea; }
        .btn { background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; transition: background 0.3s; margin-right: 0.5rem; }
        .btn:hover { background: #5a67d8; }
        .btn-secondary { background: #718096; }
        .btn-secondary:hover { background: #4a5568; }
        .user-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .user-card { background: #f8f9fa; padding: 1rem; border-radius: 8px; border: 2px solid #e1e1e1; cursor: pointer; }
        .user-card.selected { border-color: #667eea; background: #edf2f7; }
        .user-card h3 { color: #667eea; margin-bottom: 0.5rem; }
        .platform-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .platform-card { background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea; }
        .platform-card h3 { color: #667eea; margin-bottom: 0.5rem; }
        .score { font-weight: bold; color: #48bb78; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 1rem; }
        .feature-item { display: flex; align-items: center; gap: 0.5rem; }
        .feature-item input[type="checkbox"] { width: auto; }
        .results { margin-top: 2rem; }
        .alert { padding: 1rem; border-radius: 5px; margin-bottom: 1rem; }
        .alert-success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
        .alert-error { background: #fed7d7; color: #742a2a; border: 1px solid #feb2b2; }
        .alert-info { background: #bee3f8; color: #2a4365; border: 1px solid #90cdf4; }
        .hidden { display: none; }
        .loading { text-align: center; padding: 2rem; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GetConnected</h1>
            <p>Find the perfect messaging platform for your group</p>
        </div>

        <!-- User Management Section -->
        <div class="section">
            <h2>👥 Manage Users</h2>
            <div class="form-group">
                <label for="userName">Add New User:</label>
                <input type="text" id="userName" placeholder="Enter user name">
            </div>
            <div class="form-group">
                <label for="userEmail">Email (optional):</label>
                <input type="email" id="userEmail" placeholder="Enter email">
            </div>
            <button class="btn" onclick="addUser()">Add User</button>
            <button class="btn btn-secondary" onclick="loadUsers()">Refresh Users</button>
        </div>

        <!-- User List -->
        <div class="section">
            <h2>Select Group Members</h2>
            <div id="userList" class="user-list">
                <!-- Users will be loaded here -->
            </div>
        </div>

        <!-- Feature Requirements -->
        <div class="section">
            <h2>🔧 Feature Requirements</h2>
            <p>Select the features that are important for your group:</p>
            <div class="features">
                <div class="feature-item">
                    <input type="checkbox" id="voiceCalls" value="voiceCalls">
                    <label for="voiceCalls">Voice Calls</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="videoCalls" value="videoCalls">
                    <label for="videoCalls">Video Calls</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="fileSharing" value="fileSharing">
                    <label for="fileSharing">File Sharing</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="screenSharing" value="screenSharing">
                    <label for="screenSharing">Screen Sharing</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="endToEndEncryption" value="endToEndEncryption">
                    <label for="endToEndEncryption">End-to-End Encryption</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="threading" value="threading">
                    <label for="threading">Threading</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="bots" value="bots">
                    <label for="bots">Bots/Integrations</label>
                </div>
                <div class="feature-item">
                    <input type="checkbox" id="businessFeatures" value="businessFeatures">
                    <label for="businessFeatures">Business Features</label>
                </div>
            </div>
        </div>

        <!-- Analysis Button -->
        <div class="section">
            <button class="btn" onclick="analyzeGroup()">🔍 Analyze Group</button>
            <button class="btn btn-secondary" onclick="exportData()">📊 Export Data</button>
        </div>

        <!-- Results Section -->
        <div id="results" class="results hidden">
            <div class="section">
                <h2>📊 Analysis Results</h2>
                <div id="analysisResults"></div>
            </div>

            <div class="section">
                <h2>🏆 Recommended Platforms</h2>
                <div id="recommendations"></div>
            </div>
        </div>
    </div>

    <script>
        let users = [];
        let selectedUsers = [];
        let currentGroupId = null;
        let recommendations = [];

        // Load users on page load
        document.addEventListener('DOMContentLoaded', loadUsers);

        async function loadUsers() {
            try {
                const response = await fetch('/api/users');
                users = await response.json();
                renderUsers();
            } catch (error) {
                showAlert('Error loading users: ' + error.message, 'error');
            }
        }

        function renderUsers() {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';

            if (users.length === 0) {
                userList.innerHTML = '<p>No users found. Add some users first!</p>';
                return;
            }

            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = \`
                    <h3>\${user.name}</h3>
                    <p>\${user.email || 'No email'}</p>
                    <button class="btn btn-secondary" onclick="addUserPreferences(\${user.id})">Add Preferences</button>
                \`;
                
                userCard.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        toggleUser(user.id, userCard);
                    }
                });
                userList.appendChild(userCard);
            });
        }

        function toggleUser(userId, element) {
            const index = selectedUsers.indexOf(userId);
            if (index > -1) {
                selectedUsers.splice(index, 1);
                element.classList.remove('selected');
            } else {
                selectedUsers.push(userId);
                element.classList.add('selected');
            }
        }

        async function addUser() {
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();

            if (!name) {
                showAlert('Please enter a user name', 'error');
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email: email || null })
                });

                if (response.ok) {
                    document.getElementById('userName').value = '';
                    document.getElementById('userEmail').value = '';
                    showAlert('User added successfully', 'success');
                    loadUsers();
                } else {
                    const error = await response.json();
                    showAlert('Error adding user: ' + error.error, 'error');
                }
            } catch (error) {
                showAlert('Error adding user: ' + error.message, 'error');
            }
        }

        function addUserPreferences(userId) {
            const user = users.find(u => u.id === userId);
            if (!user) {
                showAlert('User not found', 'error');
                return;
            }
            
            showPreferencesModal(user);
        }

        function generatePlatformCards() {
            const platforms = [
                { key: 'whatsapp', name: 'WhatsApp', emoji: '💬', color: '#25D366' },
                { key: 'telegram', name: 'Telegram', emoji: '✈️', color: '#0088cc' },
                { key: 'signal', name: 'Signal', emoji: '🔐', color: '#3a76f0' },
                { key: 'discord', name: 'Discord', emoji: '🎮', color: '#7289da' },
                { key: 'slack', name: 'Slack', emoji: '💼', color: '#4A154B' },
                { key: 'messenger', name: 'Messenger', emoji: '💬', color: '#0084FF' },
                { key: 'imessage', name: 'iMessage', emoji: '💙', color: '#007AFF' },
                { key: 'teams', name: 'Teams', emoji: '🏢', color: '#6264A7' }
            ];
            
            return platforms.map(platform => \`
                <div class="platform-card" style="background: #2d2d44; border-radius: 12px; padding: 1.5rem; border: 2px solid #333; transition: all 0.3s; position: relative;">
                    <div class="platform-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 1.5rem;">\${platform.emoji}</div>
                        <div>
                            <h4 style="margin: 0; color: white; font-size: 1.1rem;">
                                <a href="#" class="platform-link" data-platform="\${platform.key}" style="color: \${platform.color}; text-decoration: none; font-weight: 600; transition: all 0.3s;">
                                    \${platform.name}
                                </a>
                            </h4>
                        </div>
                    </div>
                    
                    <div class="platform-controls">
                        <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; margin-bottom: 1rem; padding: 0.5rem; border-radius: 8px; background: #1a1a2e; transition: all 0.3s;">
                            <input type="checkbox" id="\${platform.key}-has-app" style="accent-color: \${platform.color}; transform: scale(1.2);">
                            <span style="font-weight: 500; color: white;">I have this app</span>
                        </label>
                        
                        <div class="preference-slider" id="\${platform.key}-slider" style="display: none; margin-top: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #64ffda; font-size: 0.9rem;">
                                How much do you like it? 
                                <span id="\${platform.key}-value" style="color: \${platform.color}; font-weight: 600;">5</span>/10
                            </label>
                            <input type="range" id="\${platform.key}-preference" min="1" max="10" value="5" style="width: 100%; accent-color: \${platform.color}; background: #1a1a2e; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;">
                                <span>Not much</span>
                                <span>Love it!</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function showPreferencesModal(user) {
            // Create modal overlay
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            \`;
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.cssText = \`
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: white;
                padding: 2rem;
                border-radius: 20px;
                max-width: 700px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                border: 1px solid #333;
                animation: slideIn 0.3s ease-out;
            \`;
            
            modalContent.innerHTML = \`
                <div class="modal-header">
                    <h2 style="margin: 0 0 0.5rem 0; color: #64ffda; font-size: 1.8rem;">📱 Setup for \${user.name}</h2>
                    <p style="margin: 0 0 1.5rem 0; opacity: 0.8; font-size: 1rem;">Select your device and choose the apps you have</p>
                </div>
                
                <div class="device-selection" style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 1rem; font-weight: 600; color: #64ffda;">📱 Your Device:</label>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem 1.5rem; background: #2d2d44; border-radius: 12px; border: 2px solid transparent; transition: all 0.3s;">
                            <input type="radio" name="device" value="ios" checked style="accent-color: #64ffda;">
                            <span style="font-weight: 500;">🍎 iPhone</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem 1.5rem; background: #2d2d44; border-radius: 12px; border: 2px solid transparent; transition: all 0.3s;">
                            <input type="radio" name="device" value="android" style="accent-color: #64ffda;">
                            <span style="font-weight: 500;">🤖 Android</span>
                        </label>
                    </div>
                </div>
                
                <div class="platforms-header" style="margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 0.5rem 0; color: #64ffda; font-size: 1.3rem;">Select Apps You Have</h3>
                    <p style="margin: 0; opacity: 0.7; font-size: 0.9rem;">Click on app names to download missing apps</p>
                </div>
                
                <div id="preferencesForm">
                    <div class="platform-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        \${generatePlatformCards()}
                    </div>
                    
                    <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid #333;">
                        <button type="button" class="btn-secondary" onclick="closePreferencesModal()" style="padding: 0.75rem 1.5rem; background: #555; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s;">Cancel</button>
                        <button type="button" class="btn-primary" onclick="savePreferences(\${user.id})" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #64ffda 0%, #4db6ac 100%); color: #1a1a2e; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s;">Save Preferences</button>
                    </div>
                </div>
            \`;
            
            // Add CSS for the modal
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .platform-card:hover {
                    border-color: #64ffda !important;
                    box-shadow: 0 4px 15px rgba(100, 255, 218, 0.1) !important;
                }
                
                .platform-card.has-app {
                    border-color: #64ffda !important;
                    background: #1a2332 !important;
                }
                
                .platform-link:hover {
                    text-shadow: 0 0 8px currentColor !important;
                }
                
                .device-selection label:hover {
                    border-color: #64ffda !important;
                    background: #1a2332 !important;
                }
                
                .device-selection input[type="radio"]:checked + span {
                    color: #64ffda !important;
                }
                
                .btn-secondary:hover {
                    background: #666 !important;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3) !important;
                }
            \`;
            
            document.head.appendChild(style);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            
            // Add event listeners for the new interface
            const platforms = ['whatsapp', 'telegram', 'signal', 'discord', 'slack', 'messenger', 'imessage', 'teams'];
            
            platforms.forEach(platform => {
                const checkbox = document.getElementById(\`\${platform}-has-app\`);
                const slider = document.getElementById(\`\${platform}-slider\`);
                const rangeInput = document.getElementById(\`\${platform}-preference\`);
                const valueDisplay = document.getElementById(\`\${platform}-value\`);
                const card = checkbox?.closest('.platform-card');
                
                if (checkbox && slider && rangeInput && valueDisplay) {
                    // Toggle slider visibility when checkbox is checked
                    checkbox.addEventListener('change', (e) => {
                        if (e.target.checked) {
                            slider.style.display = 'block';
                            card?.classList.add('has-app');
                        } else {
                            slider.style.display = 'none';
                            card?.classList.remove('has-app');
                        }
                    });
                    
                    // Update value display when slider changes
                    rangeInput.addEventListener('input', (e) => {
                        valueDisplay.textContent = e.target.value;
                    });
                }
            });
            
            // Add device selection functionality
            const deviceRadios = document.querySelectorAll('input[name="device"]');
            let selectedDevice = 'ios';
            
            deviceRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    selectedDevice = e.target.value;
                    updatePlatformLinks(selectedDevice);
                });
            });
            
            // Add platform link functionality
            function updatePlatformLinks(device) {
                const platformLinks = document.querySelectorAll('.platform-link');
                platformLinks.forEach(link => {
                    const platform = link.dataset.platform;
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        openAppStore(platform, device);
                    });
                });
            }
            
            // Initialize platform links
            updatePlatformLinks(selectedDevice);
            
            // Close modal when clicking outside
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closePreferencesModal();
                }
            });
        }

        function closePreferencesModal() {
            const modalOverlay = document.querySelector('.modal-overlay');
            if (modalOverlay) {
                modalOverlay.remove();
            }
        }
        
        function openAppStore(platform, device) {
            // Get platform data including app store links
            const platformData = {
                whatsapp: {
                    ios: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
                    android: 'https://play.google.com/store/apps/details?id=com.whatsapp'
                },
                telegram: {
                    ios: 'https://apps.apple.com/app/telegram-messenger/id686449807',
                    android: 'https://play.google.com/store/apps/details?id=org.telegram.messenger'
                },
                signal: {
                    ios: 'https://apps.apple.com/app/signal-private-messenger/id874139669',
                    android: 'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms'
                },
                discord: {
                    ios: 'https://apps.apple.com/app/discord/id985746746',
                    android: 'https://play.google.com/store/apps/details?id=com.discord'
                },
                slack: {
                    ios: 'https://apps.apple.com/app/slack/id618783545',
                    android: 'https://play.google.com/store/apps/details?id=com.Slack'
                },
                messenger: {
                    ios: 'https://apps.apple.com/app/messenger/id454638411',
                    android: 'https://play.google.com/store/apps/details?id=com.facebook.orca'
                },
                imessage: {
                    ios: 'https://apps.apple.com/app/messages/id1146560473',
                    android: null
                },
                teams: {
                    ios: 'https://apps.apple.com/app/microsoft-teams/id1113153706',
                    android: 'https://play.google.com/store/apps/details?id=com.microsoft.teams'
                }
            };
            
            const link = platformData[platform]?.[device];
            if (link) {
                window.open(link, '_blank');
            } else if (platform === 'imessage' && device === 'android') {
                showAlert('iMessage is only available on Apple devices', 'info');
            } else {
                showAlert('App store link not available', 'error');
            }
        }

        async function savePreferences(userId) {
            const platforms = ['whatsapp', 'telegram', 'signal', 'discord', 'slack', 'messenger', 'imessage', 'teams'];
            const preferences = [];
            
            // Collect preferences for each platform using the new opt-in approach
            platforms.forEach(platform => {
                const hasApp = document.getElementById(\`\${platform}-has-app\`)?.checked || false;
                const preferenceLevel = parseInt(document.getElementById(\`\${platform}-preference\`)?.value || 5);
                
                if (hasApp) {
                    preferences.push({
                        platform,
                        preferenceLevel,
                        hasAccount: true,
                        notes: \`Preference level: \${preferenceLevel}/10\`
                    });
                }
            });
            
            // Save each preference via API
            try {
                for (const pref of preferences) {
                    const response = await fetch(\`/api/users/\${userId}/preferences\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(pref)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to save preference');
                    }
                }
                
                showAlert('Preferences saved successfully!', 'success');
                closePreferencesModal();
                
                // Refresh the user display if needed
                loadUsers();
                
            } catch (error) {
                showAlert('Error saving preferences: ' + error.message, 'error');
            }
        }

        function getSelectedFeatures() {
            const features = [];
            const checkboxes = document.querySelectorAll('.feature-item input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => features.push(checkbox.value));
            return features;
        }

        async function analyzeGroup() {
            if (selectedUsers.length === 0) {
                showAlert('Please select at least one user', 'error');
                return;
            }

            const requiredFeatures = getSelectedFeatures();
            
            try {
                showLoading();
                
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userIds: selectedUsers,
                        requiredFeatures
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    currentGroupId = result.groupId;
                    recommendations = result.recommendations.recommendations;
                    
                    renderResults(result);
                    document.getElementById('results').classList.remove('hidden');
                } else {
                    const error = await response.json();
                    showAlert('Error analyzing group: ' + error.error, 'error');
                }
            } catch (error) {
                showAlert('Error analyzing group: ' + error.message, 'error');
            }
        }

        function renderResults(result) {
            const analysisDiv = document.getElementById('analysisResults');
            if (analysisDiv) {
                analysisDiv.innerHTML = \`
                    <div class="alert alert-info">
                        <strong>Analysis:</strong> \${result.commonPlatforms.analysis}
                    </div>
                    <h3>Common Platforms (\${result.commonPlatforms.commonPlatforms.length})</h3>
                    <div class="platform-grid">
                        \${result.commonPlatforms.commonPlatforms.map(platform => \`
                            <div class="platform-card">
                                <h3>\${platform.name}</h3>
                                <p>Average Preference: <span class="score">\${platform.averagePreference ? platform.averagePreference.toFixed(1) : 'N/A'}/10</span></p>
                                <p>Privacy Score: \${platform.privacyScore}/10</p>
                                <p>Popularity: \${platform.popularityScore}/10</p>
                            </div>
                        \`).join('')}
                    </div>
                \`;
            }

            const recommendationsDiv = document.getElementById('recommendations');
            if (recommendationsDiv) {
                recommendationsDiv.innerHTML = \`
                    <div class="alert alert-success">
                        <strong>Recommendation:</strong> \${result.recommendations.reason}
                    </div>
                    <div class="platform-grid">
                        \${result.recommendations.recommendations.map((rec, index) => \`
                            <div class="platform-card">
                                <h3>#\${index + 1} \${rec.name}</h3>
                                <p>Recommendation Score: <span class="score">\${rec.recommendationScore}</span></p>
                                <p>Average Preference: \${rec.averagePreference ? rec.averagePreference.toFixed(1) : 'N/A'}/10</p>
                                <p>Feature Match: \${rec.featureMatch ? '✅' : '❌'}</p>
                                \${rec.missingFeatures.length > 0 ? \`<p>Missing: \${rec.missingFeatures.join(', ')}</p>\` : ''}
                            </div>
                        \`).join('')}
                    </div>
                \`;
            }
        }

        async function exportData() {
            if (selectedUsers.length === 0) {
                showAlert('Please select users and analyze the group first', 'error');
                return;
            }

            try {
                const response = await fetch('/api/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userIds: selectedUsers,
                        format: 'json'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    downloadJSON(data, 'group-analysis.json');
                } else {
                    const error = await response.json();
                    showAlert('Error exporting data: ' + error.error, 'error');
                }
            } catch (error) {
                showAlert('Error exporting data: ' + error.message, 'error');
            }
        }

        function downloadJSON(data, filename) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = \`alert alert-\${type}\`;
            alert.textContent = message;
            
            document.body.insertBefore(alert, document.body.firstChild);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }

        function showLoading() {
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                resultsDiv.classList.remove('hidden');
                resultsDiv.innerHTML = '<div class="loading">Analyzing group preferences...</div>';
            }
        }
    </script>
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

// Start server if not in serverless mode
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;