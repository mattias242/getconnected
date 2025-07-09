# GetConnected Demo

## Overview
GetConnected is a cross-platform messaging app preference matcher and group chat coordinator. It helps groups find their messaging app common denominators and facilitates group communication.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. CLI Usage Examples

#### Basic Commands
```bash
# List available messaging platforms
node src/cli.js list-platforms

# Add a user
node src/cli.js add-user --name "John Doe" --email "john@example.com"

# Add preferences for a user (interactive)
node src/cli.js add-preferences --user "John Doe"

# Find common platforms among users
node src/cli.js find-common --users "John Doe,Jane Smith,Bob Johnson"

# Get recommendations with required features
node src/cli.js recommend --users "John Doe,Jane Smith" --features "voiceCalls,fileSharing"

# Schedule a meeting
node src/cli.js schedule --users "John Doe,Jane Smith" --platform "discord" --datetime "2024-12-25 14:00"

# Export analysis
node src/cli.js export --users "John Doe,Jane Smith" --format json
```

### 3. Web Interface
```bash
# Start web server
npm run web

# Visit http://localhost:3000
```

### 4. Example Scenarios

#### Family Group Chat
```bash
node examples/family-group.js
```

#### Work Team Coordination
```bash
node examples/work-team.js
```

#### Study Group
```bash
node examples/study-group.js
```

## Key Features Demonstrated

### 1. Platform Coverage
- **8 Major Platforms**: WhatsApp, Telegram, Signal, Discord, Slack, Messenger, iMessage, Teams
- **Comprehensive Feature Matrix**: 15+ features per platform
- **Privacy & Security Scoring**: 1-10 scale for each platform

### 2. Intelligent Recommendations
- **User Preference Weighting**: Considers individual preferences (1-10 scale)
- **Feature-Based Matching**: Matches requirements to platform capabilities
- **Privacy-Focused Options**: Recommendations based on security needs
- **Business vs Personal**: Different recommendations for different contexts

### 3. Group Coordination
- **Common Platform Detection**: Finds platforms where all members have accounts
- **Scheduling System**: Built-in meeting coordination
- **Meeting Link Generation**: Automatic link creation for supported platforms
- **Group Decision Tracking**: Saves and tracks group choices

### 4. Export & Analysis
- **JSON Export**: Comprehensive data export for analysis
- **CSV Export**: Simple format for spreadsheet analysis
- **Decision Documentation**: Reasoning behind recommendations
- **Historical Tracking**: Decision history and rationale

## Sample Output

### Platform Recommendations
```
🏆 Top Recommendations for Video Calls:
1. WhatsApp (Score: 28.6)
   Feature Match: ✅
   Average Preference: 8.3/10

2. Telegram (Score: 25.9)
   Feature Match: ✅
   Average Preference: 7.3/10

3. Signal (Score: 24)
   Feature Match: ✅
   Average Preference: 6.5/10
```

### Feature Comparison
```
Feature              WhatsApp    Telegram    Signal      
------------------------------------------------------
Voice Calls          ✅          ✅          ✅          
Video Calls          ✅          ✅          ✅          
File Sharing         ✅          ✅          ✅          
Screen Sharing       ❌          ❌          ❌          
E2E Encryption       ✅          ✅          ✅          
Threading            ❌          ❌          ❌          
```

### Privacy Analysis
```
Privacy & Security Scores:
• Signal: 10/10 (Open source, strong encryption)
• Telegram: 8/10 (Good encryption, some concerns)
• WhatsApp: 7/10 (E2E encryption, Facebook ownership)
• iMessage: 8/10 (Strong encryption, Apple ecosystem)
```

## Technical Architecture

### Core Components
1. **Platform Data Model** (`src/models/platforms.js`)
   - Comprehensive platform definitions
   - Feature matrices and scoring
   - Privacy and popularity metrics

2. **Recommendation Engine** (`src/services/recommendationEngine.js`)
   - Multi-factor scoring algorithm
   - Feature matching logic
   - Group analysis capabilities

3. **Database Layer** (`src/models/database.js`)
   - SQLite storage for user data
   - Group management
   - Decision tracking

4. **CLI Interface** (`src/cli.js`)
   - Interactive command-line tools
   - Batch processing capabilities
   - Export functionality

5. **Web Interface** (`src/web/`)
   - REST API endpoints
   - Interactive web UI
   - Real-time analysis

### Scoring Algorithm
The recommendation engine uses a multi-factor scoring system:
- **User Preference Weight**: 2x multiplier
- **Platform Quality**: Popularity (0.5x) + Privacy (0.3x)
- **Feature Bonuses**: 3 points per matched feature
- **Feature Penalties**: -5 points per missing required feature
- **Free Platform Bonus**: +2 points

## Use Cases

### 1. Family Coordination
- **Problem**: Family members use different messaging apps
- **Solution**: Find common platforms everyone already has
- **Focus**: Ease of use, reliability, video calling

### 2. Work Team Communication
- **Problem**: Team needs professional communication tools
- **Solution**: Recommend business-focused platforms
- **Focus**: Integration, threading, screen sharing, business features

### 3. Study Groups
- **Problem**: Students need file sharing and collaboration
- **Solution**: Balance privacy, features, and accessibility
- **Focus**: File sharing, voice calls, privacy for exam materials

### 4. Friend Groups
- **Problem**: Mixed preferences across age groups and tech comfort
- **Solution**: Find highest-common-denominator platforms
- **Focus**: Simplicity, widespread adoption, fun features

## Security Considerations

### Privacy Scoring Factors
- **End-to-End Encryption**: Required for high scores
- **Data Collection Practices**: Company privacy policies
- **Open Source**: Transparency in security implementation
- **Jurisdiction**: Data storage location and regulations

### Recommendation Priorities
1. **Security-First**: Signal, Telegram, iMessage for privacy-conscious users
2. **Mainstream**: WhatsApp, Messenger for broad compatibility
3. **Professional**: Slack, Teams for business environments
4. **Gaming/Communities**: Discord for specialized groups

## Extensibility

### Adding New Platforms
1. Add platform definition to `src/models/platforms.js`
2. Update feature matrix
3. Add privacy/popularity scores
4. Test with existing groups

### Custom Scoring
- Modify `calculateRecommendationScore()` in recommendation engine
- Add new feature categories
- Implement custom weighting systems

### Integration Options
- **Calendar Integration**: Add scheduling APIs
- **Platform APIs**: Real-time availability checking
- **Mobile App**: React Native implementation
- **Browser Extension**: Quick group analysis

## Next Steps

### Potential Enhancements
1. **Real-time Platform APIs**: Check actual user availability
2. **Calendar Integration**: Sync with Google/Outlook calendars
3. **Mobile App**: Native iOS/Android applications
4. **Enterprise Features**: SSO, admin controls, compliance
5. **Machine Learning**: Improve recommendations over time
6. **Multi-language Support**: Localization for global use

### Deployment Options
- **Cloud Hosting**: AWS, Google Cloud, Azure
- **Docker Containers**: Easy deployment and scaling
- **Desktop App**: Electron wrapper for standalone use
- **Corporate On-Premise**: Self-hosted for enterprise security

This tool successfully demonstrates a complete solution for group messaging coordination, balancing technical sophistication with practical usability.