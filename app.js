const express = require('express');
const dotenv = require('dotenv');
const { OpenAIService } = require('./openai-service');
const OpenAI = require('openai');

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const openai_service = new OpenAIService(client);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
})

// Example endpoint to generate a story response
app.post('/api/story', async (req, res) => {
  const { theme } = req.body;
  try {
    openai_service.setTheme(theme);
    const intro = await openai_service.getAIResponse();
    res.json(intro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate story response' + error});
  }
});

app.post('/api/story/choice', async (req, res) => {
  const { choice } = req.body;
  try{
    const answer = await openai_service.getAIResponse(choice);
    res.json(answer);
  }catch (err){
    res.status(500).json({ error: 'Failed to get story response' + error});
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});