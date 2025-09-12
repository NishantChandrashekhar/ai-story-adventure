import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { StoryType } from './story-type';
import { ShortStory } from './short-story';

export class OpenAIService {
  apiKey: string | undefined;
  model: string;
  client: OpenAI;
  storyTellerRole: string;
  history: string[][];
  introMessage: string;
  storyType: StoryType;

  constructor(client: OpenAI, model = 'gpt-3.5-turbo') {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = model;
    this.client = client;
    this.storyTellerRole = "";
    this.history = [];
    this.introMessage = "Please start the adventure!"
    this.storyType = new ShortStory();
  }

  reset(){
    this.storyTellerRole = "";
    this.storyType.reset();
  }

  setTheme(theme: string){
    this.storyTellerRole = this.storyType.getLLMRole(theme);
  }

  private generateMessagesObjectForLLM(userPrompt: string): ChatCompletionMessageParam[]{
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.storyTellerRole }
    ];
    this.history.forEach((item) => {
      messages.push({ role: 'user', content: item[0] });
      messages.push({ role: 'assistant', content: item[1] });
    });
    messages.push( {role: 'user', content: userPrompt} );
    return messages;
  }

  private getInitialMessageObject(): ChatCompletionMessageParam[]{
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.storyTellerRole },
      { role: 'user', content: this.introMessage }
    ];
    return messages
  }

  private async getResponse(userChoice: string | null){
    let messages: ChatCompletionMessageParam[];
    if(userChoice){
      const userPrompt = this.storyType.getUserPrompt(userChoice);
      console.log(userPrompt);
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

  private parseResponse(content: string) {
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