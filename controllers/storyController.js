function createStoryController(openai_service) {
    return {
      async getStoryIntro(req, res) {
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
  
      async getStoryChoice(req, res) {
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
  
  module.exports = createStoryController;