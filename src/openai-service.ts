import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

export class OpenAIService {
  apiKey: string | undefined;
  model: string;
  client: OpenAI;
  storyTellerRole: string;
  history: string[][];
  introMessage: string;
  numberOfChoicesSoFar: number = 0;
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
    this.numberOfChoicesSoFar = 0;
  }

  setTheme(theme: string){
    this.storyTellerRole = `
    You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses elaborate (without crossing 7 sentences) and always provide 4 new choices for the player. Do NOT use complex vocabulary. The user's response will come in this format:

    NUMBER OF CHOICES SO FAR: "number"
    THE CHOICE: "The choice"

    Note that the story should have a logical ending as soon as the NUMBER OF CHOICES SO FAR has reached ${OpenAIService.ITERATIONS}.
    The progression of the story should be as follows:
    1. When the NUMBER OF CHOICES SO FAR is 1, 2 or 3, the story should be in the introductory phase where you describe the environment. There should be characters introduced (along with names if relevant). When NUMBER OF CHOICES SO FAR is 3, drop a info that will be foreshadowed later.
    2. When the NUMBER OF CHOICES SO FAR is 4, 5, 6, 7 the story should contain action and character development with climax building up.
    3. When the NUMBER OF CHOICES SO FAR is 8, or 9, the story should concentrate on concluding the climax and also foreshadowing a hint dropped from before.
    4. When the NUMBER OF CHOICES SO FAR is 10, the story should have concluded, all the choices should just say "Thank you!"

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

  private getUserPrompt(userChoice: string){
    return `
      NUMBER OF CHOICES SO FAR: ${this.numberOfChoicesSoFar}
      THE CHOICE: ${userChoice}
    `;
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
      this.numberOfChoicesSoFar++;
      const userPrompt = this.getUserPrompt(userChoice);
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