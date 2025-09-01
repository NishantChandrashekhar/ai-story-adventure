const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const { OpenAIService } = require('../openai-service');
const OpenAI = require('openai');
const createStoryController = require('../controllers/storyController');

dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
const openai_service = new OpenAIService(client);
const storyController = createStoryController(openai_service);

router.post('/', storyController.getStoryIntro);
router.post('/choice', storyController.getStoryChoice);

module.exports = router;