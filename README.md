# OnboardAI - AI-Powered Onboarding Assistant

A modern, interactive AI assistant designed to help new employees get up to speed with company processes, tools, and culture.

## Features

- 🤖 **Real AI Responses**: Powered by ChatGPT 3.5 Turbo
- 🎭 **Animated Mascot**: Expressive states (thinking, excited, curious)
- 💬 **Conversation Memory**: Maintains context throughout chat
- 🎨 **Modern UI**: Clean, responsive design with glassmorphism effects
- 📱 **Mobile Friendly**: Works on all devices
- ⚡ **Fast & Lightweight**: Built with React + Vite

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
Create a `.env` file in the root directory:
```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your-actual-api-key-here
```

**Get your API key from:** [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Start Development Server
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Usage

1. **Set your API key** in the `.env` file
2. **Start the app** with `npm run dev`
3. **Ask questions** about onboarding topics
4. **Watch the mascot** react to your interactions

## Example Questions

- "What should I do on my first day?"
- "How do I access company resources?"
- "What's the company culture like?"
- "How do I set up my workspace?"
- "What tools should I install?"

## Security

- API keys are stored in environment variables (not in code)
- `.env` files are gitignored to prevent accidental commits
- No data is stored on external servers

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: CSS with glassmorphism effects
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: OpenAI ChatGPT API

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT License - feel free to use this project for your own onboarding needs!