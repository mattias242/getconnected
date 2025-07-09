# GetConnected

A cross-platform messaging app preference matcher and group chat coordinator that helps groups find their messaging app common denominators and facilitates group communication.

## Features

- **User preference collection system** - Collect each person's preferred messaging apps
- **Platform availability checker** - Check availability across WhatsApp, Telegram, Signal, Discord, Slack, and more
- **Common denominator finder** - Identify shared apps across all group members
- **Recommendation engine** - Suggest best options based on features needed
- **Group coordination tools** - Help schedule calls/chats on chosen platform
- **Web interface** - Simple web UI for easier group coordination
- **Export functionality** - Generate summaries of group preferences and recommendations

## Supported Platforms

- WhatsApp
- Telegram
- Signal
- Discord
- Slack
- Facebook Messenger
- iMessage
- Microsoft Teams

Each platform includes detailed feature comparison including:
- Voice/Video calls
- File sharing
- Screen sharing
- End-to-end encryption
- Threading support
- Bot/integration support
- Privacy scores
- Popularity metrics

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd getconnected
```

2. Install dependencies:
```bash
npm install
```

3. Make the CLI globally available (optional):
```bash
npm link
```

## Usage

### CLI Tool

#### Add a user and their preferences:
```bash
# Interactive mode
node src/cli.js add-user

# With parameters
node src/cli.js add-user --name "John Doe" --email "john@example.com"
```

#### Add preferences for existing user:
```bash
node src/cli.js add-preferences --user "John Doe"
```

#### Find common platforms among users:
```bash
# Interactive mode
node src/cli.js find-common

# With specific users
node src/cli.js find-common --users "John Doe,Jane Smith,Bob Johnson"
```

#### Get platform recommendations:
```bash
# Interactive mode
node src/cli.js recommend

# With specific users and features
node src/cli.js recommend --users "John Doe,Jane Smith" --features "voiceCalls,fileSharing,endToEndEncryption"
```

#### Schedule a group meeting:
```bash
# Interactive mode
node src/cli.js schedule

# With parameters
node src/cli.js schedule --users "John Doe,Jane Smith" --platform "discord" --datetime "2024-12-25 14:00" --minutes 90
```

#### Export group analysis:
```bash
# JSON format
node src/cli.js export --users "John Doe,Jane Smith" --format json

# CSV format
node src/cli.js export --users "John Doe,Jane Smith" --format csv
```

#### List all users:
```bash
node src/cli.js list-users
```

#### List all platforms:
```bash
node src/cli.js list-platforms
```

### Web Interface

Start the web server:
```bash
npm run web
```

Visit `http://localhost:3000` in your browser to use the web interface.

## API Endpoints

The web interface provides a REST API:

- `GET /api/users` - Get all users
- `POST /api/users` - Add a new user
- `GET /api/users/:id/preferences` - Get user preferences
- `POST /api/users/:id/preferences` - Add user preference
- `GET /api/platforms` - Get all messaging platforms
- `POST /api/analyze` - Analyze group preferences
- `POST /api/schedule` - Schedule a meeting
- `POST /api/export` - Export group data

## Examples

### Example 1: Family Group Chat

```bash
# Add family members
node src/cli.js add-user --name "Mom"
node src/cli.js add-user --name "Dad"  
node src/cli.js add-user --name "Sister"

# Add preferences (interactive)
node src/cli.js add-preferences --user "Mom"
node src/cli.js add-preferences --user "Dad"
node src/cli.js add-preferences --user "Sister"

# Find common platforms
node src/cli.js find-common --users "Mom,Dad,Sister"

# Get recommendations for video calls
node src/cli.js recommend --users "Mom,Dad,Sister" --features "videoCalls,fileSharing"
```

### Example 2: Work Team Coordination

```bash
# Add team members
node src/cli.js add-user --name "Alice" --email "alice@company.com"
node src/cli.js add-user --name "Bob" --email "bob@company.com"
node src/cli.js add-user --name "Charlie" --email "charlie@company.com"

# Find platforms with business features
node src/cli.js recommend --users "Alice,Bob,Charlie" --features "businessFeatures,threading,screenSharing"

# Schedule a team meeting
node src/cli.js schedule --users "Alice,Bob,Charlie" --platform "teams" --datetime "2024-12-20 10:00" --minutes 60
```

### Example 3: Study Group

```bash
# Quick analysis for study group
node src/cli.js find-common --users "Student1,Student2,Student3,Student4"

# Focus on platforms with good file sharing
node src/cli.js recommend --users "Student1,Student2,Student3,Student4" --features "fileSharing,screenSharing,voiceCalls"

# Export results for the group
node src/cli.js export --users "Student1,Student2,Student3,Student4" --format json > study-group-analysis.json
```

## Configuration

The application uses SQLite for local data storage. The database is automatically created in the `data/` directory.

## Platform Feature Matrix

| Platform | Voice | Video | File Share | Screen Share | E2E Encryption | Threading | Bots | Business | Free |
|----------|-------|-------|------------|--------------|----------------|-----------|------|----------|------|
| WhatsApp | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Telegram | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| Signal | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Discord | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ |
| Slack | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Messenger | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| iMessage | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Teams | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |

## Privacy & Security Scores

Each platform is rated on a privacy scale of 1-10:
- **Signal**: 10/10 (Open source, strong encryption)
- **Telegram**: 8/10 (Good encryption, some concerns)
- **WhatsApp**: 7/10 (E2E encryption, Facebook ownership)
- **iMessage**: 8/10 (Strong encryption, Apple ecosystem)
- **Slack**: 6/10 (Business focus, data retention)
- **Teams**: 6/10 (Microsoft integration, compliance)
- **Discord**: 5/10 (Gaming focus, limited encryption)
- **Messenger**: 4/10 (Facebook integration, data collection)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the documentation or create an issue in the repository.