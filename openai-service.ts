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

  async generateDefaultAdventureTheme(): Promise<string | null> {
    const prompt = this.buildDefaultThemePrompt();
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

  async generateStoryIntro(theme: string): Promise<StoryResponse | null> {
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
      return null;
    }
  }
  async generateStoryResponse(theme: string, userChoice: string, storyContext: string = ''): Promise<StoryResponse | null> {
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
      return null;
    }
  }

  private buildDefaultThemePrompt(): string {
    return `Select a theme for an adventure. The theme should be a single word or phrase that describes the setting or genre of the adventure.`;
  }
  private buildIntroPrompt(theme: string): string {
    return `You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses concise (2-3 sentences) and always provide 4 new choices for the player. There should be an element of foreshadowing in the story irrespective of the theme. Consider that the story should end after 4 choices made by the user. The theme of the adventure is ${theme}.
    
    Format your response exactly like this:
    RESPONSE: [Your narrative here]
    CHOICES:
    1. [First choice]
    2. [Second choice]
    3. [Third choice]
    4. [Fourth choice]
    `
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

    // More robust regexes
    const responseMatch = content?.match(/RESPONSE:\s*([\s\S]*?)(?:\r?\n)+CHOICES:/i);
    const choicesMatch = content?.match(/CHOICES:\s*(?:\r?\n)+([\s\S]*)/i);

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
      choices = choicesMatch[1]
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => /^\d+\.\s+/.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(choice => choice.length > 0);
    }

    return { narrative, choices };
  }
}

export default new OpenAIService(); 