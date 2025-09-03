class AppState {
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
    subscribe(listener) {
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
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
    // Get current state
    getState() {
        return { ...this.state };
    }
    // Add a message to the conversation
    addMessage(message) {
        const messages = [...this.state.messages, message];
        this.setState({ messages });
    }
    // Set choices
    setChoices(choices) {
        this.setState({ choices });
    }
    // Set loading state
    setLoading(isLoading) {
        this.setState({ isLoading });
    }
}
// Export singleton instance
const appState = new AppState();
export default appState;
//# sourceMappingURL=state.js.map