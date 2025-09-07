import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

export class OpenAIService {
  apiKey: string | undefined;
  model: string;
  client: OpenAI;
  storyTellerRole: string;
  history: string[][];
  introMessage: string;
  static ITERATIONS: number = 10;

  constructor(client: OpenAI, model = 'gpt-3.5-turbo') {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = model;
    this.client = client;
    this.storyTellerRole = "";
    this.history = [];
    this.introMessage = "Please start the adventure!"
  }

  reset(){
    this.storyTellerRole = "";
  }

  setTheme(theme: string){
    this.storyTellerRole = `
    You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses concise (2-3 sentences) and always provide 4 new choices for the player.Note that the story should end as soon as I have reached ${OpenAIService.ITERATIONS} number of choices.

    The theme of the story is as follows: \n
    ${theme} \n

    Format your response exactly like this:
    RESPONSE: [Your narrative here]
    CHOICES:
    1. [First choice]
    2. [Second choice]
    3. [Third choice]
    4. [Fourth choice]`
  }

  private generateMessagesObjectForLLM(userChoice: string): ChatCompletionMessageParam[]{
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.storyTellerRole }
    ];
    this.history.forEach((item) => {
      messages.push({ role: 'user', content: item[0] });
      messages.push({ role: 'assistant', content: item[1] });
    });
    messages.push( {role: 'user', content: userChoice} );
    return messages;
  }

  private getInitialMessageObject(): ChatCompletionMessageParam[]{
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.storyTellerRole },
      { role: 'user', content: this.introMessage }
    ];
    return messages
  }

  private async getResponse(userPrompt: string | null){
    let messages: ChatCompletionMessageParam[];
    if(userPrompt){
      messages = this.generateMessagesObjectForLLM(userPrompt);
    }else{
      messages = this.getInitialMessageObject();
    }
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      max_tokens: parseInt(process.env.MAX_TOKENS || '500'),
      temperature: parseFloat(process.env.TEMPERATURE || '0.8')
    });
    return response;
  }

  async getAIResponse(userChoice: string | null = null) {
    try {
      console.log(userChoice);
      const response = await this.getResponse(userChoice);

      const data = response.choices[0].message.content;
      const parsedResponse = this.parseResponse(data || '');
      if(!data){
        throw new Error("Something went wrong, got empty response from AI model");
      }
      this.history.push([userChoice || this.introMessage, data])
      return parsedResponse
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  }

  parseResponse(content: string) {
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

export default {
  OpenAIService
}