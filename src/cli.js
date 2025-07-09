#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const Database = require('./models/database');
const RecommendationEngine = require('./services/recommendationEngine');
const Scheduler = require('./services/scheduler');
const { getAllPlatforms, featureCategories } = require('./models/platforms');
const {
  formatPlatformList,
  formatFeatureComparison,
  formatUserPreferences,
  getSuccessMessage,
  getErrorMessage,
  getWarningMessage,
  getInfoMessage
} = require('./utils/helpers');

const program = new Command();
const db = new Database();
const engine = new RecommendationEngine(db);
const scheduler = new Scheduler(db);

program
  .name('getconnected')
  .description('CLI tool to help groups find their messaging app common denominators')
  .version('1.0.0');

// Add user command
program
  .command('add-user')
  .description('Add a person and their messaging app preferences')
  .option('-n, --name <name>', 'User name')
  .option('-e, --email <email>', 'User email (optional)')
  .action(async (options) => {
    try {
      let { name, email } = options;
      
      // Interactive prompts if not provided
      if (!name) {
        const nameAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter user name:',
            validate: input => input.trim() !== '' || 'Name cannot be empty'
          }
        ]);
        name = nameAnswer.name;
      }
      
      if (!email) {
        const emailAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'email',
            message: 'Enter email (optional):',
            default: ''
          }
        ]);
        email = emailAnswer.email || null;
      }
      
      // Check if user already exists
      const existingUser = await db.getUser(name);
      if (existingUser) {
        console.log(getWarningMessage(`User "${name}" already exists`));
        return;
      }
      
      // Add user
      const userId = await db.addUser(name, email);
      console.log(getSuccessMessage(`User "${name}" added successfully`));
      
      // Ask if they want to add preferences now
      const addPrefs = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addPreferences',
          message: 'Would you like to add messaging app preferences now?',
          default: true
        }
      ]);
      
      if (addPrefs.addPreferences) {
        await addUserPreferences(userId, name);
      }
      
    } catch (error) {
      console.error(getErrorMessage(`Error adding user: ${error.message}`));
    }
  });

// Add preferences command
program
  .command('add-preferences')
  .description('Add or update messaging app preferences for a user')
  .option('-u, --user <name>', 'User name')
  .action(async (options) => {
    try {
      let { user } = options;
      
      if (!user) {
        const users = await db.getAllUsers();
        if (users.length === 0) {
          console.log(getWarningMessage('No users found. Add a user first with: add-user'));
          return;
        }
        
        const userAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'user',
            message: 'Select user:',
            choices: users.map(u => u.name)
          }
        ]);
        user = userAnswer.user;
      }
      
      const userRecord = await db.getUser(user);
      if (!userRecord) {
        console.log(getErrorMessage(`User "${user}" not found`));
        return;
      }
      
      await addUserPreferences(userRecord.id, user);
      
    } catch (error) {
      console.error(getErrorMessage(`Error adding preferences: ${error.message}`));
    }
  });

// Find common platforms command
program
  .command('find-common')
  .description('Find common messaging platforms among group members')
  .option('-g, --group <name>', 'Group name')
  .option('-u, --users <users>', 'Comma-separated list of users')
  .action(async (options) => {
    try {
      let groupId;
      
      if (options.group) {
        // TODO: Implement group functionality
        console.log(getWarningMessage('Group functionality not yet implemented. Using user list instead.'));
      }
      
      if (options.users) {
        const userNames = options.users.split(',').map(u => u.trim());
        groupId = await createTemporaryGroup(userNames);
      } else {
        // Interactive user selection
        const users = await db.getAllUsers();
        if (users.length === 0) {
          console.log(getWarningMessage('No users found. Add users first with: add-user'));
          return;
        }
        
        const userAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedUsers',
            message: 'Select users for the group:',
            choices: users.map(u => ({ name: u.name, value: u.name })),
            validate: input => input.length > 0 || 'Select at least one user'
          }
        ]);
        
        groupId = await createTemporaryGroup(userAnswer.selectedUsers);
      }
      
      const result = await engine.findCommonPlatforms(groupId);
      
      console.log(getInfoMessage('Common Platforms Analysis:'));
      console.log(result.analysis);
      console.log('\n' + getInfoMessage('Common Platforms:'));
      console.log(formatPlatformList(result.commonPlatforms));
      
    } catch (error) {
      console.error(getErrorMessage(`Error finding common platforms: ${error.message}`));
    }
  });

// Recommend command
program
  .command('recommend')
  .description('Get platform recommendations based on group needs')
  .option('-g, --group <name>', 'Group name')
  .option('-u, --users <users>', 'Comma-separated list of users')
  .option('-f, --features <features>', 'Comma-separated list of required features')
  .action(async (options) => {
    try {
      let groupId;
      let requiredFeatures = [];
      
      if (options.users) {
        const userNames = options.users.split(',').map(u => u.trim());
        groupId = await createTemporaryGroup(userNames);
      } else {
        // Interactive user selection
        const users = await db.getAllUsers();
        if (users.length === 0) {
          console.log(getWarningMessage('No users found. Add users first with: add-user'));
          return;
        }
        
        const userAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedUsers',
            message: 'Select users for the group:',
            choices: users.map(u => ({ name: u.name, value: u.name })),
            validate: input => input.length > 0 || 'Select at least one user'
          }
        ]);
        
        groupId = await createTemporaryGroup(userAnswer.selectedUsers);
      }
      
      if (options.features) {
        requiredFeatures = options.features.split(',').map(f => f.trim());
      } else {
        // Interactive feature selection
        const featureAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'features',
            message: 'Select required features (optional):',
            choices: [
              { name: 'Voice Calls', value: 'voiceCalls' },
              { name: 'Video Calls', value: 'videoCalls' },
              { name: 'File Sharing', value: 'fileSharing' },
              { name: 'Screen Sharing', value: 'screenSharing' },
              { name: 'End-to-End Encryption', value: 'endToEndEncryption' },
              { name: 'Threading', value: 'threading' },
              { name: 'Bots/Integrations', value: 'bots' },
              { name: 'Business Features', value: 'businessFeatures' }
            ]
          }
        ]);
        requiredFeatures = featureAnswer.features;
      }
      
      const result = await engine.recommendPlatforms(groupId, requiredFeatures);
      
      console.log(getInfoMessage('Platform Recommendations:'));
      console.log(result.reason);
      console.log('\n' + getInfoMessage('Recommended Platforms:'));
      console.log(formatPlatformList(result.recommendations));
      
      if (requiredFeatures.length > 0) {
        console.log('\n' + getInfoMessage('Feature Comparison:'));
        const comparison = await engine.getFeatureComparison(groupId, requiredFeatures);
        console.log(formatFeatureComparison(comparison));
      }
      
    } catch (error) {
      console.error(getErrorMessage(`Error getting recommendations: ${error.message}`));
    }
  });

// List users command
program
  .command('list-users')
  .description('List all users and their preferences')
  .action(async () => {
    try {
      const users = await db.getAllUsers();
      if (users.length === 0) {
        console.log(getWarningMessage('No users found'));
        return;
      }
      
      console.log(getInfoMessage('Users:'));
      for (const user of users) {
        console.log(`\n${user.name} ${user.email ? `(${user.email})` : ''}`);
        const preferences = await db.getUserPreferences(user.id);
        console.log(formatUserPreferences(preferences));
      }
      
    } catch (error) {
      console.error(getErrorMessage(`Error listing users: ${error.message}`));
    }
  });

// List platforms command
program
  .command('list-platforms')
  .description('List all available messaging platforms')
  .action(() => {
    try {
      const platforms = getAllPlatforms();
      console.log(getInfoMessage('Available Messaging Platforms:'));
      console.log(formatPlatformList(platforms));
      
    } catch (error) {
      console.error(getErrorMessage(`Error listing platforms: ${error.message}`));
    }
  });

// Schedule command
program
  .command('schedule')
  .description('Schedule a group chat or call')
  .option('-u, --users <users>', 'Comma-separated list of users')
  .option('-p, --platform <platform>', 'Platform to use')
  .option('-d, --datetime <datetime>', 'Date and time (YYYY-MM-DD HH:MM)')
  .option('-m, --minutes <minutes>', 'Duration in minutes', '60')
  .action(async (options) => {
    try {
      let groupId;
      let platform = options.platform;
      let datetime = options.datetime;
      let duration = parseInt(options.minutes) || 60;
      
      // Get users
      if (options.users) {
        const userNames = options.users.split(',').map(u => u.trim());
        groupId = await createTemporaryGroup(userNames);
      } else {
        const users = await db.getAllUsers();
        if (users.length === 0) {
          console.log(getWarningMessage('No users found. Add users first with: add-user'));
          return;
        }
        
        const userAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedUsers',
            message: 'Select users for the group:',
            choices: users.map(u => ({ name: u.name, value: u.name })),
            validate: input => input.length > 0 || 'Select at least one user'
          }
        ]);
        
        groupId = await createTemporaryGroup(userAnswer.selectedUsers);
      }
      
      // Get platform recommendation if not provided
      if (!platform) {
        const result = await engine.recommendPlatforms(groupId, ['voiceCalls']);
        if (result.recommendations.length > 0) {
          const platformAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'platform',
              message: 'Select platform:',
              choices: result.recommendations.slice(0, 5).map(p => ({
                name: `${p.name} (Score: ${p.recommendationScore})`,
                value: p.key
              }))
            }
          ]);
          platform = platformAnswer.platform;
        } else {
          console.log(getErrorMessage('No common platforms found for the group'));
          return;
        }
      }
      
      // Get datetime if not provided
      if (!datetime) {
        const timeAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'datetime',
            message: 'Enter date and time (YYYY-MM-DD HH:MM):',
            validate: input => {
              const date = new Date(input);
              return !isNaN(date.getTime()) || 'Please enter a valid date and time';
            }
          },
          {
            type: 'input',
            name: 'duration',
            message: 'Duration in minutes:',
            default: '60',
            validate: input => {
              const num = parseInt(input);
              return (num > 0 && num <= 1440) || 'Please enter a valid duration (1-1440 minutes)';
            }
          }
        ]);
        
        datetime = timeAnswer.datetime;
        duration = parseInt(timeAnswer.duration);
      }
      
      // Schedule the meeting
      const scheduleId = await scheduler.scheduleGroupChat(groupId, platform, datetime, duration);
      
      // Save group decision
      await db.saveGroupDecision(groupId, platform, 'Scheduled meeting');
      
      console.log(getSuccessMessage(`Meeting scheduled successfully (ID: ${scheduleId})`));
      console.log(getInfoMessage(`Platform: ${platform}`));
      console.log(getInfoMessage(`Date/Time: ${datetime}`));
      console.log(getInfoMessage(`Duration: ${duration} minutes`));
      
      // Generate meeting link
      const meetingLink = scheduler.generateMeetingLink(platform, `Group ${groupId}`);
      console.log(getInfoMessage(`Meeting link: ${meetingLink}`));
      
    } catch (error) {
      console.error(getErrorMessage(`Error scheduling meeting: ${error.message}`));
    }
  });

// Export command
program
  .command('export')
  .description('Export group preferences and recommendations')
  .option('-u, --users <users>', 'Comma-separated list of users')
  .option('-f, --format <format>', 'Export format (json, csv)', 'json')
  .action(async (options) => {
    try {
      let groupId;
      
      if (options.users) {
        const userNames = options.users.split(',').map(u => u.trim());
        groupId = await createTemporaryGroup(userNames);
      } else {
        const users = await db.getAllUsers();
        if (users.length === 0) {
          console.log(getWarningMessage('No users found. Add users first with: add-user'));
          return;
        }
        
        const userAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedUsers',
            message: 'Select users for the group:',
            choices: users.map(u => ({ name: u.name, value: u.name })),
            validate: input => input.length > 0 || 'Select at least one user'
          }
        ]);
        
        groupId = await createTemporaryGroup(userAnswer.selectedUsers);
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
      
      if (options.format === 'json') {
        console.log(JSON.stringify(exportData, null, 2));
      } else if (options.format === 'csv') {
        // Simple CSV export for platforms
        console.log('Platform,Score,Average Preference,Privacy Score,Popularity Score');
        recommendations.recommendations.forEach(rec => {
          console.log(`${rec.name},${rec.recommendationScore},${rec.averagePreference},${rec.privacyScore},${rec.popularityScore}`);
        });
      }
      
    } catch (error) {
      console.error(getErrorMessage(`Error exporting data: ${error.message}`));
    }
  });

// Helper functions
async function addUserPreferences(userId, userName) {
  const platforms = getAllPlatforms();
  
  for (const platform of platforms) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasAccount',
        message: `Do you have a ${platform.name} account?`,
        default: false
      }
    ]);
    
    if (answers.hasAccount) {
      const prefAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'preference',
          message: `Rate your preference for ${platform.name} (1-10):`,
          default: '5',
          validate: input => {
            const num = parseInt(input);
            return (num >= 1 && num <= 10) || 'Please enter a number between 1 and 10';
          }
        },
        {
          type: 'input',
          name: 'notes',
          message: `Any notes about ${platform.name}? (optional):`,
          default: ''
        }
      ]);
      
      await db.addUserPreference(
        userId,
        platform.key,
        parseInt(prefAnswers.preference),
        true,
        prefAnswers.notes || null
      );
    }
  }
  
  console.log(getSuccessMessage(`Preferences added for ${userName}`));
}

async function createTemporaryGroup(userNames) {
  const groupId = await db.createGroup(`temp_group_${Date.now()}`);
  
  for (const userName of userNames) {
    const user = await db.getUser(userName);
    if (user) {
      await db.addUserToGroup(groupId, user.id);
    } else {
      console.log(getWarningMessage(`User "${userName}" not found`));
    }
  }
  
  return groupId;
}

// Handle cleanup
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

program.parse();