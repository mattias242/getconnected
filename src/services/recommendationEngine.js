const { getAllPlatforms, compareFeatures, calculateScore } = require('../models/platforms');

class RecommendationEngine {
  constructor(database) {
    this.db = database;
  }

  async findCommonPlatforms(groupId) {
    const preferences = await this.db.getGroupPreferences(groupId);
    const members = await this.db.getGroupMembers(groupId);
    
    if (members.length === 0) {
      return { commonPlatforms: [], analysis: 'No members in group' };
    }

    // Group preferences by platform
    const platformData = {};
    preferences.forEach(pref => {
      if (!platformData[pref.platform]) {
        platformData[pref.platform] = {
          users: [],
          totalPreference: 0,
          hasAccountCount: 0
        };
      }
      
      platformData[pref.platform].users.push({
        name: pref.name,
        preferenceLevel: pref.preference_level,
        hasAccount: pref.has_account,
        notes: pref.notes
      });
      
      platformData[pref.platform].totalPreference += pref.preference_level;
      if (pref.has_account) {
        platformData[pref.platform].hasAccountCount++;
      }
    });

    // Find platforms where all members have accounts
    const commonPlatforms = [];
    const allPlatforms = getAllPlatforms();
    
    Object.keys(platformData).forEach(platformKey => {
      const data = platformData[platformKey];
      if (data.hasAccountCount === members.length) {
        const platform = allPlatforms.find(p => p.key === platformKey);
        if (platform) {
          commonPlatforms.push({
            ...platform,
            averagePreference: data.totalPreference / members.length,
            allHaveAccounts: true,
            memberDetails: data.users
          });
        }
      }
    });

    // Sort by average preference
    commonPlatforms.sort((a, b) => b.averagePreference - a.averagePreference);

    return {
      commonPlatforms,
      analysis: this.generateAnalysis(commonPlatforms, members.length, platformData)
    };
  }

  async recommendPlatforms(groupId, requiredFeatures = []) {
    const { commonPlatforms } = await this.findCommonPlatforms(groupId);
    
    if (commonPlatforms.length === 0) {
      return {
        recommendations: [],
        reason: 'No common platforms found where all members have accounts'
      };
    }

    const recommendations = commonPlatforms.map(platform => {
      const featureMatch = requiredFeatures.length === 0 || 
        requiredFeatures.every(feature => platform.features[feature]);
      
      const score = this.calculateRecommendationScore(platform, requiredFeatures);
      
      return {
        ...platform,
        featureMatch,
        recommendationScore: score,
        missingFeatures: requiredFeatures.filter(feature => !platform.features[feature])
      };
    });

    // Sort by recommendation score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return {
      recommendations,
      reason: this.generateRecommendationReason(recommendations, requiredFeatures)
    };
  }

  calculateRecommendationScore(platform, requiredFeatures = []) {
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

  generateAnalysis(commonPlatforms, memberCount, platformData) {
    if (commonPlatforms.length === 0) {
      return `No platforms found where all ${memberCount} members have accounts. Consider platforms where most members are present.`;
    }

    const topPlatform = commonPlatforms[0];
    let analysis = `Found ${commonPlatforms.length} platform(s) where all ${memberCount} members have accounts. `;
    analysis += `Top choice: ${topPlatform.name} (avg preference: ${topPlatform.averagePreference.toFixed(1)}/10)`;
    
    return analysis;
  }

  generateRecommendationReason(recommendations, requiredFeatures) {
    if (recommendations.length === 0) {
      return 'No suitable platforms found';
    }

    const topRec = recommendations[0];
    let reason = `${topRec.name} is recommended based on `;
    
    const reasons = [];
    if (topRec.averagePreference > 7) {
      reasons.push('high user preference');
    }
    if (topRec.privacyScore > 7) {
      reasons.push('strong privacy');
    }
    if (topRec.popularityScore > 8) {
      reasons.push('widespread adoption');
    }
    if (requiredFeatures.length > 0 && topRec.featureMatch) {
      reasons.push('feature requirements match');
    }
    
    reason += reasons.join(', ');
    
    if (topRec.missingFeatures.length > 0) {
      reason += `. Note: Missing features - ${topRec.missingFeatures.join(', ')}`;
    }
    
    return reason;
  }

  async getFeatureComparison(groupId, features) {
    const { commonPlatforms } = await this.findCommonPlatforms(groupId);
    
    const comparison = {};
    commonPlatforms.forEach(platform => {
      comparison[platform.key] = {
        name: platform.name,
        features: {}
      };
      
      features.forEach(feature => {
        comparison[platform.key].features[feature] = platform.features[feature];
      });
    });
    
    return comparison;
  }
}

module.exports = RecommendationEngine;