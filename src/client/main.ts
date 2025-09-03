// Main Application Entry Point
import appState from './state.js';
import ui from './ui.js';
import eventHandler from './events.js';

// Application class to manage the overall app lifecycle
class StoryTellerApp {
  isInitialized: boolean;
  constructor() {
    this.isInitialized = false;
  }

  // Initialize the application
  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize event handlers
      eventHandler.init();
      
      // Set initial UI state
      ui.hideChoices();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('Story Teller App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Story Teller App:', error);
    }
  }

  // Get app state (for debugging)
  getState() {
    return appState.getState();
  }

  // Reset the entire application
  reset() {
    eventHandler.reset();
  }
}

// Create and export the main app instance
const app = new StoryTellerApp();

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});

// Export for potential external use
export default app;
