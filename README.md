# AI Story Adventure

An interactive story adventure game powered by OpenAI's GPT API.

## Features

- 🎮 **Interactive Storytelling**: Dynamic story generation based on user choices
- 🎨 **Theme-Based Adventures**: Customize your adventure theme (medieval, sci-fi, detective, horror, western)
- 💬 **ChatGPT-Style Interface**: Modern, responsive UI similar to ChatGPT
- 🤖 **AI-Powered Responses**: Real-time story generation using OpenAI API
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
# Install TypeScript and dependencies
npm install
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### 3. Configure Your API Key

1. Create your `.env` in your project
2. Replace `'your_openai_api_key_here'` with your actual API key:

```typescript
  OPENAI_API_KEY: 'sk-your-actual-api-key-here',
  // ... other env vars
```

### 4. Run the backend

```bash
nodemon app
```

3. Navigate to `http://localhost:3000` in your browser

## Security Notes

- ⚠️ **Never commit your API key to version control**
- ✅ The `.env` file is already in `.gitignore`
- 🔒 For production, use environment variables instead of hardcoded keys

## How It Works

1. **Theme Input**: Users describe their desired adventure theme
2. **Story Generation**: OpenAI API generates personalized story intros
3. **Interactive Choices**: AI creates dynamic responses based on user choices
4. **Context Awareness**: The AI remembers the story context for continuity

## API Configuration

You can customize the OpenAI settings in `.env`:

```javascript
  OPENAI_API_KEY: 'your-key'
  OPENAI_MODEL: 'gpt-3.5-turbo'  // or 'gpt-4' for better quality
  MAX_TOKENS: 500                // Response length limit
  TEMPERATURE: 0.8                 // Creativity level (0-1)
```

## Troubleshooting

### API Key Issues
- Make sure your API key is correct and active
- Check your OpenAI account has sufficient credits
- Verify the key format starts with `sk-`

### CORS Issues
- Use a local server instead of opening the HTML file directly
- The OpenAI API requires proper HTTP requests

### Fallback Mode
- If the API fails, the app uses pre-written fallback responses
- Check the browser console for error messages

## File Structure

```
├── index.html              # Main application
├── style.css               # Styling and layout
├── script.ts               # Main application logic (TypeScript)
├── game-state.ts           # Game state management (TypeScript)
├── config.ts               # API configuration (add your key here)
├── openai-service.ts       # OpenAI API integration (TypeScript)
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies and scripts
├── .gitignore              # Protects sensitive files
└── README.md               # This file
```

## Customization

### Adding New Themes
Edit the `generateStoryIntro()` and `generateInitialChoices()` functions in `script.ts` to add new theme support.

### Modifying AI Prompts
Update the `buildPrompt()` method in `openai-service.ts` to change how the AI generates responses.

### Styling Changes
Modify `style.css` to customize the appearance and layout.

## License

This project is for educational purposes. Please respect OpenAI's terms of service when using their API. 
