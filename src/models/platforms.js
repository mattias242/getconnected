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
  imessage: {
    name: 'iMessage',
    features: {
      textMessages: true,
      voiceCalls: false,
      videoCalls: false,
      groupChats: true,
      fileSharing: true,
      screenSharing: false,
      endToEndEncryption: true,
      desktopApp: true,
      webApp: false,
      maxGroupSize: 32,
      businessFeatures: false,
      integrations: false,
      threading: false,
      customEmojis: false,
      bots: false
    },
    platforms: ['iOS', 'macOS'],
    privacyScore: 8,
    popularityScore: 7,
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

const featureCategories = {
  communication: ['textMessages', 'voiceCalls', 'videoCalls', 'groupChats'],
  sharing: ['fileSharing', 'screenSharing'],
  security: ['endToEndEncryption'],
  accessibility: ['desktopApp', 'webApp'],
  advanced: ['threading', 'customEmojis', 'bots', 'integrations', 'businessFeatures']
};

const getPlatformByKey = (key) => {
  return messagingPlatforms[key] || null;
};

const getAllPlatforms = () => {
  return Object.keys(messagingPlatforms).map(key => ({
    key,
    ...messagingPlatforms[key]
  }));
};

const getPlatformsByFeature = (feature) => {
  return Object.keys(messagingPlatforms).filter(key => 
    messagingPlatforms[key].features[feature]
  );
};

const compareFeatures = (platformKeys, requiredFeatures = []) => {
  const results = {};
  
  platformKeys.forEach(key => {
    const platform = messagingPlatforms[key];
    if (!platform) return;
    
    results[key] = {
      name: platform.name,
      hasAllFeatures: requiredFeatures.every(feature => platform.features[feature]),
      features: platform.features,
      score: calculateScore(platform, requiredFeatures)
    };
  });
  
  return results;
};

const calculateScore = (platform, requiredFeatures = []) => {
  let score = 0;
  
  // Base score from popularity and privacy
  score += platform.popularityScore * 0.3;
  score += platform.privacyScore * 0.2;
  
  // Feature bonus
  requiredFeatures.forEach(feature => {
    if (platform.features[feature]) {
      score += 5;
    }
  });
  
  // Free to use bonus
  if (platform.freeToUse) {
    score += 3;
  }
  
  return Math.round(score * 10) / 10;
};

module.exports = {
  messagingPlatforms,
  featureCategories,
  getPlatformByKey,
  getAllPlatforms,
  getPlatformsByFeature,
  compareFeatures,
  calculateScore
};