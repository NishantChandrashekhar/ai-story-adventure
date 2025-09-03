// API Communication Module
class StoryAPI {
  baseURL: string;
  constructor() {
    this.baseURL = '/api';
  }

  async request(endpoint: string, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async startStory(theme: string) {
    return this.request('/story', {
      method: 'POST',
      body: JSON.stringify({ theme })
    });
  }

  async sendChoice(choice: string) {
    return this.request('/story/choice', {
      method: 'POST',
      body: JSON.stringify({ choice })
    });
  }
}

// Export singleton instance
const storyAPI = new StoryAPI();
export default storyAPI;
