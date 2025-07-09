#!/usr/bin/env node

const Database = require('../src/models/database');
const RecommendationEngine = require('../src/services/recommendationEngine');
const fs = require('fs');

async function studyGroupExample() {
  console.log('📚 Study Group Coordination Example\n');
  
  const db = new Database();
  const engine = new RecommendationEngine(db);
  
  try {
    // Add study group members
    console.log('Adding study group members...');
    const alexId = await db.addUser('Alex Chen', 'alex@university.edu');
    const mariaId = await db.addUser('Maria Rodriguez', 'maria@university.edu');
    const davidId = await db.addUser('David Kim', 'david@university.edu');
    const sarahId = await db.addUser('Sarah Johnson', 'sarah@university.edu');
    const mikeSId = await db.addUser('Mike Thompson', 'mike@university.edu');
    
    // Add preferences for Alex (Tech-savvy, prefers Discord and Telegram)
    await db.addUserPreference(alexId, 'discord', 9, true, 'Great for study groups');
    await db.addUserPreference(alexId, 'telegram', 8, true, 'File sharing');
    await db.addUserPreference(alexId, 'slack', 7, true, 'Organized channels');
    await db.addUserPreference(alexId, 'whatsapp', 6, true, 'Everyone has it');
    await db.addUserPreference(alexId, 'signal', 5, true, 'Privacy focused');
    
    // Add preferences for Maria (Prefers mainstream apps)
    await db.addUserPreference(mariaId, 'whatsapp', 9, true, 'Daily use');
    await db.addUserPreference(mariaId, 'messenger', 8, true, 'Facebook integration');
    await db.addUserPreference(mariaId, 'telegram', 7, true, 'Group features');
    await db.addUserPreference(mariaId, 'discord', 6, true, 'Learning to use');
    await db.addUserPreference(mariaId, 'signal', 5, true, 'Privacy conscious');
    
    // Add preferences for David (Balanced approach)
    await db.addUserPreference(davidId, 'telegram', 9, true, 'Best for file sharing');
    await db.addUserPreference(davidId, 'whatsapp', 8, true, 'Reliable');
    await db.addUserPreference(davidId, 'discord', 7, true, 'Voice channels');
    await db.addUserPreference(davidId, 'signal', 6, true, 'Secure');
    await db.addUserPreference(davidId, 'slack', 5, true, 'Professional');
    
    // Add preferences for Sarah (Privacy focused)
    await db.addUserPreference(sarahId, 'signal', 9, true, 'Privacy first');
    await db.addUserPreference(sarahId, 'telegram', 8, true, 'Good features');
    await db.addUserPreference(sarahId, 'whatsapp', 7, true, 'Convenient');
    await db.addUserPreference(sarahId, 'discord', 6, true, 'Study groups');
    await db.addUserPreference(sarahId, 'messenger', 4, true, 'Rarely use');
    
    // Add preferences for Mike (Simple approach)
    await db.addUserPreference(mikeSId, 'whatsapp', 9, true, 'Simple and reliable');
    await db.addUserPreference(mikeSId, 'telegram', 7, true, 'Good for groups');
    await db.addUserPreference(mikeSId, 'messenger', 6, true, 'Some friends use it');
    await db.addUserPreference(mikeSId, 'discord', 5, true, 'Complex but useful');
    await db.addUserPreference(mikeSId, 'signal', 4, true, 'Privacy matters');
    
    // Create study group
    const groupId = await db.createGroup('Computer Science Study Group', 'CS 101 study group');
    await db.addUserToGroup(groupId, alexId);
    await db.addUserToGroup(groupId, mariaId);
    await db.addUserToGroup(groupId, davidId);
    await db.addUserToGroup(groupId, sarahId);
    await db.addUserToGroup(groupId, mikeSId);
    
    console.log('✅ Study group members added with preferences\n');
    
    // Find common platforms
    console.log('🔍 Finding common platforms...');
    const commonResult = await engine.findCommonPlatforms(groupId);
    console.log(`Analysis: ${commonResult.analysis}\n`);
    
    console.log('📱 Common Platforms:');
    commonResult.commonPlatforms.forEach((platform, index) => {
      console.log(`${index + 1}. ${platform.name}`);
      console.log(`   Average Preference: ${platform.averagePreference.toFixed(1)}/10`);
      console.log(`   File Sharing: ${platform.features.fileSharing ? '✅' : '❌'}`);
      console.log(`   Voice Calls: ${platform.features.voiceCalls ? '✅' : '❌'}`);
      console.log(`   Group Size Limit: ${platform.maxGroupSize.toLocaleString()}`);
      console.log('');
    });
    
    // Get recommendations for study group features
    console.log('💡 Getting recommendations for study group needs...');
    const studyResult = await engine.recommendPlatforms(groupId, [
      'fileSharing', 'voiceCalls', 'groupChats'
    ]);
    console.log(`Reason: ${studyResult.reason}\n`);
    
    console.log('🏆 Top Recommendations for Study Groups:');
    studyResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (Score: ${rec.recommendationScore})`);
      console.log(`   File Sharing: ${rec.features.fileSharing ? '✅' : '❌'}`);
      console.log(`   Voice Calls: ${rec.features.voiceCalls ? '✅' : '❌'}`);
      console.log(`   Screen Sharing: ${rec.features.screenSharing ? '✅' : '❌'}`);
      console.log(`   Max Group Size: ${rec.maxGroupSize.toLocaleString()}`);
      console.log(`   Free to Use: ${rec.freeToUse ? '✅' : '❌'}`);
      console.log(`   Average Preference: ${rec.averagePreference.toFixed(1)}/10`);
      if (rec.missingFeatures.length > 0) {
        console.log(`   Missing Features: ${rec.missingFeatures.join(', ')}`);
      }
      console.log('');
    });
    
    // Get recommendations for exam preparation (privacy focused)
    console.log('🔒 Getting recommendations for secure exam preparation...');
    const examResult = await engine.recommendPlatforms(groupId, [
      'endToEndEncryption', 'fileSharing', 'voiceCalls'
    ]);
    console.log(`Reason: ${examResult.reason}\n`);
    
    console.log('🔐 Top Recommendations for Secure Study Sessions:');
    examResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (Score: ${rec.recommendationScore})`);
      console.log(`   End-to-End Encryption: ${rec.features.endToEndEncryption ? '✅' : '❌'}`);
      console.log(`   Privacy Score: ${rec.privacyScore}/10`);
      console.log(`   File Sharing: ${rec.features.fileSharing ? '✅' : '❌'}`);
      console.log(`   Voice Calls: ${rec.features.voiceCalls ? '✅' : '❌'}`);
      console.log(`   Average Preference: ${rec.averagePreference.toFixed(1)}/10`);
      console.log('');
    });
    
    // Export comprehensive analysis
    console.log('📊 Exporting comprehensive analysis...');
    const members = await db.getGroupMembers(groupId);
    const exportData = {
      timestamp: new Date().toISOString(),
      studyGroup: {
        name: 'Computer Science Study Group',
        subject: 'CS 101',
        members: members.map(m => ({ name: m.name, email: m.email })),
        memberCount: members.length
      },
      analysis: {
        overview: commonResult.analysis,
        commonPlatforms: commonResult.commonPlatforms,
        studyRecommendations: studyResult.recommendations,
        privacyRecommendations: examResult.recommendations
      },
      recommendations: {
        topChoice: studyResult.recommendations[0],
        reasoning: studyResult.reason,
        alternativeForPrivacy: examResult.recommendations[0]
      },
      featureMatrix: {
        fileSharing: studyResult.recommendations.map(r => ({ 
          platform: r.name, 
          supported: r.features.fileSharing 
        })),
        voiceCalls: studyResult.recommendations.map(r => ({ 
          platform: r.name, 
          supported: r.features.voiceCalls 
        })),
        screenSharing: studyResult.recommendations.map(r => ({ 
          platform: r.name, 
          supported: r.features.screenSharing 
        })),
        encryption: studyResult.recommendations.map(r => ({ 
          platform: r.name, 
          supported: r.features.endToEndEncryption 
        }))
      }
    };
    
    // Save export data
    fs.writeFileSync('study-group-analysis.json', JSON.stringify(exportData, null, 2));
    console.log('✅ Analysis exported to study-group-analysis.json\n');
    
    // Platform usage scenarios
    console.log('📖 Platform Usage Scenarios:\n');
    
    const topChoice = studyResult.recommendations[0];
    console.log(`🥇 Primary Platform: ${topChoice.name}`);
    console.log(`   Best for: Daily communication, file sharing, group discussions`);
    console.log(`   Strengths: ${topChoice.averagePreference.toFixed(1)}/10 preference, ${topChoice.features.fileSharing ? 'excellent' : 'limited'} file sharing`);
    console.log('');
    
    const privacyChoice = examResult.recommendations[0];
    if (privacyChoice.key !== topChoice.key) {
      console.log(`🔒 Privacy-Focused Alternative: ${privacyChoice.name}`);
      console.log(`   Best for: Sensitive discussions, exam preparation, private study notes`);
      console.log(`   Strengths: ${privacyChoice.privacyScore}/10 privacy score, end-to-end encryption`);
      console.log('');
    }
    
    // Study schedule suggestions
    console.log('📅 Suggested Study Schedule:');
    console.log(`• Daily check-ins: ${topChoice.name} (quick updates, file sharing)`);
    console.log(`• Weekly study sessions: ${topChoice.name} (voice calls, screen sharing)`);
    console.log(`• Exam preparation: ${privacyChoice.name} (secure discussions, private notes)`);
    console.log(`• Emergency communications: WhatsApp (most members have high preference)`);
    console.log('');
    
    // Final decision
    console.log('🎯 Final Decision Framework:');
    console.log(`Based on the analysis of ${members.length} study group members:`);
    console.log('');
    console.log('For regular study activities:');
    console.log(`→ Use ${topChoice.name} (Score: ${topChoice.recommendationScore})`);
    console.log(`  • ${topChoice.averagePreference.toFixed(1)}/10 average preference`);
    console.log(`  • File sharing: ${topChoice.features.fileSharing ? 'Excellent' : 'Limited'}`);
    console.log(`  • Voice calls: ${topChoice.features.voiceCalls ? 'Supported' : 'Not supported'}`);
    console.log(`  • Free to use: ${topChoice.freeToUse ? 'Yes' : 'No'}`);
    console.log('');
    
    if (privacyChoice.key !== topChoice.key) {
      console.log('For sensitive/private discussions:');
      console.log(`→ Use ${privacyChoice.name} (Privacy Score: ${privacyChoice.privacyScore}/10)`);
      console.log(`  • End-to-end encryption: ${privacyChoice.features.endToEndEncryption ? 'Yes' : 'No'}`);
      console.log(`  • Privacy focused: High security for exam materials`);
      console.log('');
    }
    
    // Save group decision
    await db.saveGroupDecision(groupId, topChoice.key, `Study group primary platform - Score: ${topChoice.recommendationScore}`);
    
    console.log('✅ Group decision saved. Happy studying! 📚');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  studyGroupExample();
}

module.exports = studyGroupExample;