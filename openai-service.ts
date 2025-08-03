import config from './config.js';

interface StoryResponse {
  narrative: string;
  choices: string[];
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface FallbackResponse {
  narrative: string;
  choices: string[];
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = config.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  async generateDefaultAdventure(): Promise<string> {
    const prompt = this.buildIntroPrompt('medieval');
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: config.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: config.MAX_TOKENS,
        temperature: config.TEMPERATURE
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message.content || '';
  }

  async generateStoryIntro(theme: string): Promise<StoryResponse> {
    try {
      const prompt = this.buildIntroPrompt(theme);
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: prompt
            }
          ],
          max_tokens: config.MAX_TOKENS,
          temperature: config.TEMPERATURE
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(theme, '');
    }
  }
  async generateStoryResponse(theme: string, userChoice: string, storyContext: string = ''): Promise<StoryResponse> {
    try {
      const prompt = this.buildPrompt(theme, userChoice, storyContext);
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses concise (2-3 sentences) and always provide 4 new choices for the player.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.MAX_TOKENS,
          temperature: config.TEMPERATURE
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return this.parseResponse(data);
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(theme, userChoice);
    }
  }

  private buildIntroPrompt(theme: string): string {
    return `You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses concise (2-3 sentences) and always provide 4 new choices for the player. The theme of the adventure is ${theme}.`
  }

  private buildPrompt(theme: string, userChoice: string, storyContext: string): string {
    return `Theme: ${theme}
    
Current Story Context: ${storyContext || 'Beginning of adventure'}
    
Player's Choice: ${userChoice}
    
Please continue the story based on the player's choice. Provide:
1. A narrative response (2-3 sentences)
2. Four new choices for the player (numbered 1-4)

Format your response exactly like this:
RESPONSE: [Your narrative here]
CHOICES:
1. [First choice]
2. [Second choice]
3. [Third choice]
4. [Fourth choice]`;
  }

  private parseResponse(data: OpenAIResponse): StoryResponse {
    const content = data?.choices[0]?.message.content;
    
    // Parse the response to extract narrative and choices
    const responseMatch = content?.match(/RESPONSE:\s*(.*?)(?=\nCHOICES:|$)/s);
    const choicesMatch = content?.match(/CHOICES:\s*\n((?:\d+\.\s*.*?\n?)+)/s);
    
    let narrative = 'The story continues with an unexpected twist...';
    let choices = [
      'Continue exploring',
      'Investigate further',
      'Take a different approach',
      'Follow your instincts'
    ];
    
    if (responseMatch && responseMatch[1]) {
      narrative = responseMatch[1].trim();
    }
    
    if (choicesMatch && choicesMatch[1]) {
      const choicesText = choicesMatch[1];
      choices = choicesText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(choice => choice.length > 0);
    }
    
    return { narrative, choices };
  }

  private getFallbackResponse(theme: string, userChoice: string): StoryResponse {
    // Fallback responses when API fails
    const fallbacks: Record<string, FallbackResponse> = {
      'medieval': {
        narrative: 'You continue your quest through the medieval realm, encountering new challenges and opportunities.',
        choices: ['Seek the local blacksmith', 'Visit the castle library', 'Explore the nearby village', 'Follow the ancient map']
      },
      'sci-fi': {
        narrative: 'The starship systems respond to your input, revealing new data and potential destinations.',
        choices: ['Analyze the sensor data', 'Contact the engineering team', 'Plot a course to the anomaly', 'Review the mission logs']
      },
      'detective': {
        narrative: 'Your investigation leads to new clues and potential witnesses in the case.',
        choices: ['Interview the suspect', 'Examine the crime scene', 'Check the surveillance footage', 'Follow the money trail']
      },
      'horror': {
        narrative: 'The shadows seem to move around you, and you hear distant sounds that make your skin crawl.',
        choices: ['Investigate the noise', 'Search for a light source', 'Call out for help', 'Try to find an exit']
      },
      'western': {
        narrative: 'The dusty trail leads you deeper into the wild west, where danger and opportunity await.',
        choices: ['Ride to the next town', 'Check the local saloon', 'Visit the sheriff\'s office', 'Follow the outlaw\'s trail']
      }
    };

    const lowerTheme = theme.toLowerCase();
    for (const [key, response] of Object.entries(fallbacks)) {
      if (lowerTheme.includes(key)) {
        return response;
      }
    }
    
    return {
      narrative: 'Your adventure continues with new possibilities unfolding before you.',
      choices: ['Explore further', 'Seek assistance', 'Investigate clues', 'Take a different path']
    };
  }
}

export default new OpenAIService(); 