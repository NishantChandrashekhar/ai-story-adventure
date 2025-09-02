class OpenAIService {
  constructor(client, model = 'gpt-3.5-turbo') {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = model;
    this.client = client;
    this.theme = "";
    this.storyContext = "";
    this.storyTellerRole = `You are a creative storyteller creating interactive adventures. Generate engaging, immersive responses that continue the story based on the user's choices. Keep responses concise (2-3 sentences) and always provide 4 new choices for the player.`;
  }

  reset(){
    this.theme = "";
    this.storyContext = "";
  }

  setTheme(theme){
    this.theme = theme;
  }

  async getResponse(userPrompt, systemRole= 'You are an helpful story assistant'){
    console.log(`Max tokens: ${parseInt(process.env.MAX_TOKENS)} and temperature is: ${parseFloat(process.env.TEMPERATURE)}`)
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages:[
        { role: 'system', content: systemRole},
        { role: 'user', content: userPrompt }
      ],
      max_tokens: parseInt(process.env.MAX_TOKENS),
      temperature: parseFloat(process.env.TEMPERATURE)
    });
    return response;
  }

  async getAIResponse(userChoice) {
    try {
      const prompt = this.buildPrompt(userChoice);
      const response = await this.getResponse(prompt, this.storyTellerRole);

      const data = response.choices[0].message.content;
      return this.parseResponse(data);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  }

  buildPrompt(userChoice) {
    console.log(this.theme);
    console.log(this.storyContext);
    return `Theme: ${this.theme}
    
Current Story Context: ${this.storyContext || 'Beginning of adventure'}
    
Player's Choice: ${userChoice || 'No choice, the story is yet to begin'}
    
Please continue (or start) the story based on the player's choice. Provide:
1. A narrative response (2-3 sentences)
2. Four new choices for the player (numbered 1-4)

Format your response exactly like this:
RESPONSE: [Your narrative here]
CHOICES:
1. [First choice]
2. [Second choice]
3. [Third choice]
4. [Fourth choice]
STORYCONTEXT: [The story context up till now including the latest choice]`;
  }

  parseResponse(content) {
    console.log(content);
    // More robust regexes
    const responseMatch = content?.match(/RESPONSE:\s*([\s\S]*?)(?:\r?\n)+CHOICES:/i);
    const choicesMatch = content?.match(/CHOICES:\s*(?:\r?\n)+([\s\S]*)/i);
    const storyContextMatch = content?.match(/STORYCONTEXT:\s*([\s\S]*)/i);

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

    if (storyContextMatch && storyContextMatch[1]) {
      this.storyContext = storyContextMatch[1].trim();
    }

    return { narrative, choices };
  }
}

module.exports = {
  OpenAIService
}