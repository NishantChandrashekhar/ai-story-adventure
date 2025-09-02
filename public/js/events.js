// Events Module - Handles all event listeners and business logic
import appState from './state.js';
import storyAPI from './api.js';
import ui from './ui.js';

class EventHandler {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize all event listeners
  init() {
    if (this.isInitialized) return;
    
    this.setupChoiceButtons();
    this.setupFormSubmission();
    this.setupCancelButton();
    this.setupStateSubscription();
    this.setUpNewStoryButton();
    this.setUpClearChatButton();
    
    this.isInitialized = true;
  }

  // Setup choice button event listeners using event delegation
  setupChoiceButtons() {
    ui.elements.choicesContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('choice-btn')) {
        await this.handleChoiceClick(e.target.textContent);
      }
    });
  }

  // Setup form submission
  setupFormSubmission() {
    ui.elements.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmit();
    });
  }

  // Setup cancel button
  setupCancelButton() {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        ui.hideModal();
      });
    }
  }

  // Setup state subscription for reactive UI updates
  setupStateSubscription() {
    appState.subscribe((state) => {
      // Update UI based on state changes
      ui.updateChoices(state.choices);
      
      if (state.isLoading) {
        ui.showLoading();
      } else {
        ui.hideLoading();
      }
    });
  }

  setUpNewStoryButton(){
    ui.elements.newStoryButton.addEventListener('click', async (e)=>{
      this.handleNewStoryButton();
    });
  }

  setUpClearChatButton(){
    ui.elements.clearChatButton.addEventListener('click', async () =>{
      this.handleClearChat();
    })
  }

  // Handle choice button click
  async handleChoiceClick(choice) {
    try {
      // Update state
      appState.setLoading(true);
      appState.addMessage({ type: 'user', content: choice });
      
      // Update UI
      ui.addUserMessage(choice);
      
      // Call API
      const data = await storyAPI.sendChoice(choice);
      
      // Update state with response
      appState.setChoices(data.choices || []);
      if (data.narrative) {
        appState.addMessage({ type: 'assistant', content: data.narrative });
        ui.addAssistantMessage(data.narrative);
      }
      
    } catch (error) {
      console.error('Error handling choice:', error);
      // You could add error handling UI here
    } finally {
      appState.setLoading(false);
    }
  }

  // Handle form submission
  async handleFormSubmit() {
    const theme = ui.getThemeValue();
    
    if (!theme.trim()) {
      // Let browser show validation error
      return;
    }

    try {
      // Update state
      appState.setLoading(true);
      appState.setState({ theme });
      
      // Hide modal
      ui.hideModal();
      
      // Clear previous messages
      ui.clearMessages();
      
      // Call API
      const data = await storyAPI.startStory(theme);
      
      // Update state with response
      appState.setChoices(data.choices || []);
      if (data.narrative) {
        appState.addMessage({ type: 'assistant', content: data.narrative });
        ui.addAssistantMessage(data.narrative);
      }
      
    } catch (error) {
      console.error('Error starting story:', error);
      // You could add error handling UI here
      ui.showModal(); // Show modal again on error
    } finally {
      appState.setLoading(false);
    }
  }

  handleNewStoryButton(){
    this.reset();
  }

  handleClearChat(){
    this.reset(false);
  }

  // Reset the application state
  reset(showStartModal = true) {
    appState.setState({
      choices: [],
      narrative: "",
      theme: "",
      isLoading: false,
      messages: []
    });
    
    ui.hideChoices();
    if(showStartModal) ui.showModal();
    ui.clearMessages();
    ui.resetForm();
  }
}

// Export singleton instance
const eventHandler = new EventHandler();
export default eventHandler;
