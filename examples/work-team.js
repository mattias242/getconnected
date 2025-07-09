#!/usr/bin/env node

const Database = require('../src/models/database');
const RecommendationEngine = require('../src/services/recommendationEngine');
const Scheduler = require('../src/services/scheduler');

async function workTeamExample() {
  console.log('💼 Work Team Coordination Example\n');
  
  const db = new Database();
  const engine = new RecommendationEngine(db);
  const scheduler = new Scheduler(db);
  
  try {
    // Add team members
    console.log('Adding team members...');
    const aliceId = await db.addUser('Alice Johnson', 'alice@company.com');
    const bobId = await db.addUser('Bob Smith', 'bob@company.com');
    const charlieId = await db.addUser('Charlie Brown', 'charlie@company.com');
    const dianaId = await db.addUser('Diana Prince', 'diana@company.com');
    
    // Add preferences for Alice (Manager - prefers business tools)
    await db.addUserPreference(aliceId, 'teams', 9, true, 'Company standard');
    await db.addUserPreference(aliceId, 'slack', 8, true, 'Team communication');
    await db.addUserPreference(aliceId, 'discord', 6, true, 'Informal chats');
    await db.addUserPreference(aliceId, 'telegram', 5, true, 'Personal use');
    
    // Add preferences for Bob (Developer - prefers Slack and Discord)
    await db.addUserPreference(bobId, 'slack', 9, true, 'Daily development work');
    await db.addUserPreference(bobId, 'discord', 8, true, 'Developer communities');
    await db.addUserPreference(bobId, 'teams', 7, true, 'Company meetings');
    await db.addUserPreference(bobId, 'telegram', 6, true, 'Some work groups');
    
    // Add preferences for Charlie (Designer - prefers creative tools)
    await db.addUserPreference(charlieId, 'discord', 9, true, 'Design communities');
    await db.addUserPreference(charlieId, 'slack', 8, true, 'Work collaboration');
    await db.addUserPreference(charlieId, 'teams', 7, true, 'Company standard');
    await db.addUserPreference(charlieId, 'telegram', 6, true, 'Creative groups');
    
    // Add preferences for Diana (HR - prefers professional tools)
    await db.addUserPreference(dianaId, 'teams', 9, true, 'HR standard');
    await db.addUserPreference(dianaId, 'slack', 8, true, 'Team coordination');
    await db.addUserPreference(dianaId, 'whatsapp', 6, true, 'Quick updates');
    await db.addUserPreference(dianaId, 'telegram', 5, true, 'Some groups');
    
    // Create work team group
    const groupId = await db.createGroup('Development Team', 'Main development team communication');
    await db.addUserToGroup(groupId, aliceId);
    await db.addUserToGroup(groupId, bobId);
    await db.addUserToGroup(groupId, charlieId);
    await db.addUserToGroup(groupId, dianaId);
    
    console.log('✅ Team members added with preferences\n');
    
    // Find common platforms
    console.log('🔍 Finding common platforms...');
    const commonResult = await engine.findCommonPlatforms(groupId);
    console.log(`Analysis: ${commonResult.analysis}\n`);
    
    console.log('📱 Common Platforms:');
    commonResult.commonPlatforms.forEach((platform, index) => {
      console.log(`${index + 1}. ${platform.name}`);
      console.log(`   Average Preference: ${platform.averagePreference.toFixed(1)}/10`);
      console.log(`   Business Features: ${platform.businessFeatures ? '✅' : '❌'}`);
      console.log(`   Threading: ${platform.features.threading ? '✅' : '❌'}`);
      console.log(`   Integrations: ${platform.features.integrations ? '✅' : '❌'}`);
      console.log('');
    });
    
    // Get recommendations for business features
    console.log('💡 Getting recommendations for business collaboration...');
    const businessResult = await engine.recommendPlatforms(groupId, [
      'businessFeatures', 'threading', 'integrations', 'screenSharing'
    ]);
    console.log(`Reason: ${businessResult.reason}\n`);
    
    console.log('🏆 Top Recommendations for Business Use:');
    businessResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (Score: ${rec.recommendationScore})`);
      console.log(`   Business Features: ${rec.features.businessFeatures ? '✅' : '❌'}`);
      console.log(`   Threading: ${rec.features.threading ? '✅' : '❌'}`);
      console.log(`   Screen Sharing: ${rec.features.screenSharing ? '✅' : '❌'}`);
      console.log(`   Integrations: ${rec.features.integrations ? '✅' : '❌'}`);
      console.log(`   Average Preference: ${rec.averagePreference.toFixed(1)}/10`);
      if (rec.missingFeatures.length > 0) {
        console.log(`   Missing Features: ${rec.missingFeatures.join(', ')}`);
      }
      console.log('');
    });
    
    // Schedule a team meeting
    console.log('📅 Scheduling team meeting...');
    const topPlatform = businessResult.recommendations[0];
    const meetingDateTime = new Date();
    meetingDateTime.setDate(meetingDateTime.getDate() + 1); // Tomorrow
    meetingDateTime.setHours(10, 0, 0, 0); // 10:00 AM
    
    const scheduleId = await scheduler.scheduleGroupChat(
      groupId,
      topPlatform.key,
      meetingDateTime.toISOString(),
      60,
      'Weekly team standup'
    );
    
    await db.saveGroupDecision(groupId, topPlatform.key, 'Team meeting platform');
    
    console.log(`✅ Meeting scheduled on ${topPlatform.name}`);
    console.log(`   Date: ${meetingDateTime.toLocaleDateString()}`);
    console.log(`   Time: ${meetingDateTime.toLocaleTimeString()}`);
    console.log(`   Duration: 60 minutes`);
    console.log(`   Meeting ID: ${scheduleId}`);
    
    const meetingLink = scheduler.generateMeetingLink(topPlatform.key, 'Development Team');
    console.log(`   Meeting Link: ${meetingLink}`);
    console.log('');
    
    // Feature comparison for decision making
    console.log('📊 Feature Comparison for Top 3 Platforms:');
    const featureComparison = await engine.getFeatureComparison(groupId, [
      'businessFeatures', 'threading', 'integrations', 'screenSharing', 'videoCalls', 'fileSharing'
    ]);
    
    const topThree = businessResult.recommendations.slice(0, 3);
    const features = ['businessFeatures', 'threading', 'integrations', 'screenSharing', 'videoCalls', 'fileSharing'];
    
    console.log('Feature'.padEnd(20) + topThree.map(p => p.name.padEnd(12)).join(''));
    console.log(''.padEnd(20 + topThree.length * 12, '-'));
    
    features.forEach(feature => {
      const featureName = feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let row = featureName.padEnd(20);
      
      topThree.forEach(platform => {
        const hasFeature = platform.features[feature];
        row += (hasFeature ? '✅' : '❌').padEnd(12);
      });
      
      console.log(row);
    });
    
    console.log('');
    
    // Final recommendation
    console.log('📋 Final Recommendation:');
    const finalChoice = businessResult.recommendations[0];
    console.log(`For your development team, ${finalChoice.name} is the recommended platform.`);
    console.log(`\nKey benefits:`);
    console.log(`• High team preference score: ${finalChoice.averagePreference.toFixed(1)}/10`);
    console.log(`• Business features: ${finalChoice.features.businessFeatures ? 'Full support' : 'Limited'}`);
    console.log(`• Threading support: ${finalChoice.features.threading ? 'Yes' : 'No'}`);
    console.log(`• Integration capabilities: ${finalChoice.features.integrations ? 'Extensive' : 'Limited'}`);
    console.log(`• Screen sharing: ${finalChoice.features.screenSharing ? 'Available' : 'Not available'}`);
    console.log(`• Free to use: ${finalChoice.freeToUse ? 'Yes' : 'Paid service'}`);
    
    if (finalChoice.missingFeatures.length > 0) {
      console.log(`\nNote: Missing features - ${finalChoice.missingFeatures.join(', ')}`);
      console.log('Consider these limitations when making your final decision.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  workTeamExample();
}

module.exports = workTeamExample;