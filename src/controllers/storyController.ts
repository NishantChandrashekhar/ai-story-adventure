import { OpenAIService } from "../llm/openai-service";
import { Request, Response } from "express";

function createStoryController(openai_service: OpenAIService) {
    return {
      async getStoryIntro(req: Request, res: Response) {
        const { theme } = req.body;
        try {
          openai_service.reset();
          openai_service.setTheme(theme);
          const intro = await openai_service.getAIResponse();
          res.json(intro);
        } catch (error) {
          res.status(500).json({ error: 'Failed to generate story response' + error });
        }
      },
  
      async getStoryChoice(req: Request, res: Response) {
        const { choice } = req.body;
        try {
          const answer = await openai_service.getAIResponse(choice);
          res.json(answer);
        } catch (error) {
          res.status(500).json({ error: 'Failed to get story response' + error });
        }
      }
    };
  }
  
  export default createStoryController;