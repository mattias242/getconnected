const chalk = require('chalk');

const formatTable = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const colWidths = headers.map(header => Math.max(
    header.length,
    ...data.map(row => String(row[header] || '').length)
  ));
  
  let output = '';
  
  // Header
  output += '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐\n';
  output += '│' + headers.map((header, i) => 
    ` ${header.padEnd(colWidths[i])} `
  ).join('│') + '│\n';
  output += '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤\n';
  
  // Data rows
  data.forEach(row => {
    output += '│' + headers.map((header, i) => 
      ` ${String(row[header] || '').padEnd(colWidths[i])} `
    ).join('│') + '│\n';
  });
  
  output += '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘\n';
  
  return output;
};

const formatPlatformList = (platforms) => {
  if (!platforms || platforms.length === 0) {
    return chalk.yellow('No platforms found');
  }
  
  return platforms.map((platform, index) => {
    const rank = chalk.bold(`${index + 1}.`);
    const name = chalk.cyan(platform.name);
    const score = platform.recommendationScore ? 
      chalk.green(`(Score: ${platform.recommendationScore})`) : '';
    const preference = platform.averagePreference ? 
      chalk.blue(`Avg Preference: ${platform.averagePreference.toFixed(1)}/10`) : '';
    
    let output = `${rank} ${name} ${score} ${preference}`;
    
    if (platform.missingFeatures && platform.missingFeatures.length > 0) {
      output += chalk.red(` Missing: ${platform.missingFeatures.join(', ')}`);
    }
    
    return output;
  }).join('\n');
};

const formatFeatureComparison = (comparison) => {
  const platforms = Object.keys(comparison);
  if (platforms.length === 0) return 'No platforms to compare';
  
  const features = Object.keys(comparison[platforms[0]].features);
  const data = [];
  
  features.forEach(feature => {
    const row = { Feature: feature };
    platforms.forEach(platformKey => {
      const platform = comparison[platformKey];
      row[platform.name] = platform.features[feature] ? '✓' : '✗';
    });
    data.push(row);
  });
  
  const headers = ['Feature', ...platforms.map(key => comparison[key].name)];
  return formatTable(data, headers);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatUserPreferences = (preferences) => {
  if (!preferences || preferences.length === 0) {
    return chalk.yellow('No preferences set');
  }
  
  return preferences.map(pref => {
    const platform = chalk.cyan(pref.platform);
    const level = chalk.green(`${pref.preference_level}/10`);
    const account = pref.has_account ? chalk.green('✓') : chalk.red('✗');
    const notes = pref.notes ? chalk.gray(`(${pref.notes})`) : '';
    
    return `${platform} - Preference: ${level} - Has Account: ${account} ${notes}`;
  }).join('\n');
};

const getSuccessMessage = (message) => chalk.green(`✓ ${message}`);
const getErrorMessage = (message) => chalk.red(`✗ ${message}`);
const getWarningMessage = (message) => chalk.yellow(`⚠ ${message}`);
const getInfoMessage = (message) => chalk.blue(`ℹ ${message}`);

module.exports = {
  formatTable,
  formatPlatformList,
  formatFeatureComparison,
  validateEmail,
  formatUserPreferences,
  getSuccessMessage,
  getErrorMessage,
  getWarningMessage,
  getInfoMessage
};