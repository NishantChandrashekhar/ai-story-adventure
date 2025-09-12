import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { OpenAIService } from '../llm/openai-service';
import { Router } from 'express';
import createStoryController from '../controllers/storyController';

dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
  });
const openai_service = new OpenAIService(client);
const storyController = createStoryController(openai_service);

const router = Router();
router.post('/', storyController.getStoryIntro);
router.post('/choice', storyController.getStoryChoice);

export default router;