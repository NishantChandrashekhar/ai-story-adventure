// API Communication Module
class StoryAPI {
    constructor() {
        this.baseURL = '/api';
    }
    async request(endpoint, options = {}) {
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
        }
        catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    async startStory(theme) {
        return this.request('/story', {
            method: 'POST',
            body: JSON.stringify({ theme })
        });
    }
    async sendChoice(choice) {
        return this.request('/story/choice', {
            method: 'POST',
            body: JSON.stringify({ choice })
        });
    }
}
// Export singleton instance
const storyAPI = new StoryAPI();
export default storyAPI;
//# sourceMappingURL=api.js.map