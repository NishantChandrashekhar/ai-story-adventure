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
npm install
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### 3. Configure Your API Key

1. Create a `.env` file in your project root
2. Add your OpenAI API key and other settings:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-3.5-turbo   # or 'gpt-4' for better quality
MAX_TOKENS=500               # Response length limit
TEMPERATURE=0.8              # Creativity level (0-1)
```

### 4. Run the backend

```bash
node app.js
```

5. Navigate to `http://localhost:3000` in your browser

## Security Notes

- ⚠️ **Never commit your API key to version control**
- ✅ The `.env` file is already in `.gitignore`
- 🔒 For production, use environment variables instead of hardcoded keys

## How It Works

1. **Theme Input**: Users describe their desired adventure theme
2. **Story Generation**: OpenAI API generates personalized story intros
3. **Interactive Choices**: AI creates dynamic responses based on user choices
4. **Context Awareness**: The AI remembers the story context for continuity

## File Structure

```
├── app.js                  # Express backend server
├── openai-service.js       # OpenAI API integration
├── public/
│   ├── index.html          # Main application HTML
│   ├── main.js             # Main application logic (JavaScript)
│   └── style.css           # Styling and layout
├── dist/                   # Compiled/transpiled files (if any)
├── package.json            # Project dependencies and scripts
├── .gitignore              # Protects sensitive files
└── README.md               # This file
```

## Customization

### Adding New Themes
Edit the story prompt logic in `openai-service.js` or adjust the frontend in `public/main.js` to support new theme options.

### Modifying AI Prompts
Update the `buildPrompt()` method in `openai-service.js` to change how the AI generates responses.

### Styling Changes
Modify `public/style.css` to customize the appearance and layout.

## License

This project is for educational purposes. Please respect OpenAI's terms of service when using their API. 
