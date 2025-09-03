// State Management Module
export type AppStateData = {
  choices: string[],
  narrative: string,
  theme: string,
  isLoading: boolean,
  messages: { type: string; content: string }[]
};
class AppState {
  state: AppStateData;
  listeners: ((state: AppStateData) => void)[];
  constructor() {
    this.state = {
      choices: [],
      narrative: "",
      theme: "",
      isLoading: false,
      messages: []
    };
    this.listeners = [];
  }

  // Subscribe to state changes
  subscribe(listener: (state: AppStateData) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Update state and notify listeners
  setState(newState: Partial<AppStateData>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Add a message to the conversation
  addMessage(message: { type: string; content: string }) {
    const messages = [...this.state.messages, message];
    this.setState({ messages });
  }

  // Set choices
  setChoices(choices: string[]) {
    this.setState({ choices });
  }

  // Set loading state
  setLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }
}

// Export singleton instance
const appState = new AppState();
export default appState;
