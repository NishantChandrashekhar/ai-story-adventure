// UI Module - Handles all DOM manipulation
class UI {
  elements: {
    startModal: HTMLElement | null;
    choicesContainer: HTMLElement | null;
    messagesContainer: HTMLElement | null;
    choiceButtons: NodeListOf<HTMLButtonElement> | null;
    form: HTMLFormElement | null;
    themeInput: HTMLInputElement;
    newStoryButton: HTMLElement | null;
    clearChatButton: HTMLElement | null;
  };
  constructor() {
    this.elements = {
      startModal: document.getElementsByClassName("modal")[0] as HTMLElement,
      choicesContainer: document.getElementById("choices"),
      messagesContainer: document.getElementById("messages"),
      choiceButtons: document.querySelectorAll('.choice-btn'),
      form: document.querySelector('#startModal form'),
      themeInput: document.getElementById("adventureTheme") as HTMLInputElement,
      newStoryButton: document.getElementsByClassName("new-story-btn")[0] as HTMLElement,
      clearChatButton: document.getElementsByClassName("clear-chat-btn")[0] as HTMLElement
    };
  }

  // Update choices display
  updateChoices(choices: string[]) {
    if (!choices || !Array.isArray(choices)) {
      this.hideChoices();
      return;
    }

    // Update button text and show/hide as needed
    if(!this.elements.choiceButtons) return;
    this.elements.choiceButtons.forEach((button: HTMLButtonElement, index: number) => {
      if (index < choices.length) {
        button.textContent = choices[index];
        button.style.display = 'flex';
      } else {
        button.style.display = 'none';
      }
    });

    this.showChoices();
  }

  // Show choices container
  showChoices() {
    if(!this.elements.choicesContainer) return;
    this.elements.choicesContainer.style.display = 'flex';
  }

  // Hide choices container
  hideChoices() {
    if(!this.elements.choicesContainer) return;
    this.elements.choicesContainer.style.display = 'none';
  }

  // Add assistant message to chat
  addAssistantMessage(message: string) {
    if(!this.elements.messagesContainer) return;
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'message assistant';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-content';
    
    const p = document.createElement("p");
    p.textContent = message;
    
    messageDiv.appendChild(p);
    assistantDiv.appendChild(messageDiv);
    this.elements.messagesContainer.appendChild(assistantDiv);
    
    // Scroll to bottom
    this.scrollToBottom();
  }

  // Add user message to chat
  addUserMessage(choice: string) {
    if(!this.elements.messagesContainer) return;
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-content';
    
    const p = document.createElement("p");
    p.textContent = choice;
    
    messageDiv.appendChild(p);
    userDiv.appendChild(messageDiv);
    this.elements.messagesContainer.appendChild(userDiv);
    
    // Scroll to bottom
    this.scrollToBottom();
  }

  // Show modal
  showModal() {
    if(!this.elements.startModal) return;
    this.elements.startModal.style.display = 'flex';
  }

  // Hide modal
  hideModal() {
    if(!this.elements.startModal) return;
    this.elements.startModal.style.display = 'none';
  }

  // Show loading state
  showLoading() {
    if(!this.elements.choicesContainer) return;
    // You can add a loading spinner here
    this.elements.choicesContainer.style.opacity = '0.5';
  }

  // Hide loading state
  hideLoading() {
    if(!this.elements.choicesContainer) return;
    this.elements.choicesContainer.style.opacity = '1';
  }

  // Scroll messages to bottom
  scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container') as HTMLElement;
    if(chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // Clear messages
  clearMessages() {
    if(!this.elements.messagesContainer) return;
    this.elements.messagesContainer.innerHTML = '';
  }

  // Get theme input value
  getThemeValue() {
    return this.elements.themeInput.value;
  }

  // Reset form
  resetForm() {
    if(!this.elements.form) return;
    this.elements.form.reset();
  }
}

// Export singleton instance
const ui = new UI();
export default ui;
