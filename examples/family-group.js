#!/usr/bin/env node

const Database = require('../src/models/database');
const RecommendationEngine = require('../src/services/recommendationEngine');
const { getAllPlatforms } = require('../src/models/platforms');

async function familyGroupExample() {
  console.log('🏠 Family Group Chat Example\n');
  
  const db = new Database();
  const engine = new RecommendationEngine(db);
  
  try {
    // Add family members
    console.log('Adding family members...');
    const momId = await db.addUser('Mom', 'mom@family.com');
    const dadId = await db.addUser('Dad', 'dad@family.com');
    const sisterId = await db.addUser('Sister', 'sister@family.com');
    const brotherId = await db.addUser('Brother', 'brother@family.com');
    
    // Add preferences for Mom (prefers WhatsApp and Signal)
    await db.addUserPreference(momId, 'whatsapp', 9, true, 'Use daily');
    await db.addUserPreference(momId, 'signal', 8, true, 'Privacy conscious');
    await db.addUserPreference(momId, 'telegram', 6, true, 'Occasional use');
    await db.addUserPreference(momId, 'messenger', 4, true, 'Rarely use');
    
    // Add preferences for Dad (prefers Telegram and WhatsApp)
    await db.addUserPreference(dadId, 'telegram', 9, true, 'Daily use for work');
    await db.addUserPreference(dadId, 'whatsapp', 8, true, 'Family communication');
    await db.addUserPreference(dadId, 'signal', 7, true, 'Privacy matters');
    await db.addUserPreference(dadId, 'discord', 5, true, 'Gaming with friends');
    
    // Add preferences for Sister (prefers Discord and Telegram)
    await db.addUserPreference(sisterId, 'discord', 9, true, 'Gaming and friends');
    await db.addUserPreference(sisterId, 'telegram', 8, true, 'School groups');
    await db.addUserPreference(sisterId, 'whatsapp', 7, true, 'Family');
    await db.addUserPreference(sisterId, 'signal', 6, true, 'Privacy');
    await db.addUserPreference(sisterId, 'messenger', 5, true, 'Some friends');
    
    // Add preferences for Brother (prefers WhatsApp and Messenger)
    await db.addUserPreference(brotherId, 'whatsapp', 9, true, 'Main communication');
    await db.addUserPreference(brotherId, 'messenger', 8, true, 'Facebook friends');
    await db.addUserPreference(brotherId, 'telegram', 6, true, 'Some groups');
    await db.addUserPreference(brotherId, 'signal', 5, true, 'Privacy conscious');
    
    // Create family group
    const groupId = await db.createGroup('Family Group', 'Main family communication');
    await db.addUserToGroup(groupId, momId);
    await db.addUserToGroup(groupId, dadId);
    await db.addUserToGroup(groupId, sisterId);
    await db.addUserToGroup(groupId, brotherId);
    
    console.log('✅ Family members added with preferences\n');
    
    // Find common platforms
    console.log('🔍 Finding common platforms...');
    const commonResult = await engine.findCommonPlatforms(groupId);
    console.log(`Analysis: ${commonResult.analysis}\n`);
    
    console.log('📱 Common Platforms:');
    commonResult.commonPlatforms.forEach((platform, index) => {
      console.log(`${index + 1}. ${platform.name}`);
      console.log(`   Average Preference: ${platform.averagePreference.toFixed(1)}/10`);
      console.log(`   Privacy Score: ${platform.privacyScore}/10`);
      console.log(`   Popularity: ${platform.popularityScore}/10`);
      console.log(`   All members have accounts: ${platform.allHaveAccounts ? '✅' : '❌'}`);
      console.log('');
    });
    
    // Get recommendations for video calls
    console.log('💡 Getting recommendations for video calls...');
    const videoResult = await engine.recommendPlatforms(groupId, ['videoCalls']);
    console.log(`Reason: ${videoResult.reason}\n`);
    
    console.log('🏆 Top Recommendations for Video Calls:');
    videoResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (Score: ${rec.recommendationScore})`);
      console.log(`   Feature Match: ${rec.featureMatch ? '✅' : '❌'}`);
      console.log(`   Average Preference: ${rec.averagePreference.toFixed(1)}/10`);
      if (rec.missingFeatures.length > 0) {
        console.log(`   Missing Features: ${rec.missingFeatures.join(', ')}`);
      }
      console.log('');
    });
    
    // Get recommendations for privacy-focused communication
    console.log('🔒 Getting recommendations for privacy-focused communication...');
    const privacyResult = await engine.recommendPlatforms(groupId, ['endToEndEncryption']);
    console.log(`Reason: ${privacyResult.reason}\n`);
    
    console.log('🔐 Top Recommendations for Privacy:');
    privacyResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (Score: ${rec.recommendationScore})`);
      console.log(`   Privacy Score: ${rec.privacyScore}/10`);
      console.log(`   End-to-End Encryption: ${rec.features.endToEndEncryption ? '✅' : '❌'}`);
      console.log(`   Average Preference: ${rec.averagePreference.toFixed(1)}/10`);
      console.log('');
    });
    
    // Final recommendation
    console.log('📋 Final Recommendation:');
    const topChoice = commonResult.commonPlatforms[0];
    if (topChoice) {
      console.log(`Based on the analysis, ${topChoice.name} appears to be the best choice for your family group.`);
      console.log(`It has the highest average preference score (${topChoice.averagePreference.toFixed(1)}/10) and all family members have accounts.`);
      console.log(`Privacy Score: ${topChoice.privacyScore}/10`);
      console.log(`Supports video calls: ${topChoice.features.videoCalls ? '✅' : '❌'}`);
      console.log(`Supports file sharing: ${topChoice.features.fileSharing ? '✅' : '❌'}`);
      console.log(`End-to-end encryption: ${topChoice.features.endToEndEncryption ? '✅' : '❌'}`);
      
      // Save the decision
      await db.saveGroupDecision(groupId, topChoice.key, 'Family group consensus based on preferences');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  familyGroupExample();
}

module.exports = familyGroupExample;