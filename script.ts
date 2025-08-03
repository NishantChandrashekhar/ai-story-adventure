import openAIService from './openai-service.js';
import { GameState } from './game-state.js';

// DOM Elements
const startModal = document.getElementById('startModal') as HTMLDivElement;
const adventureThemeInput = document.getElementById('adventureTheme') as HTMLTextAreaElement;
const charCount = document.getElementById('charCount') as HTMLSpanElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const userName = document.getElementById('userName') as HTMLSpanElement;
const messages = document.getElementById('messages') as HTMLDivElement;
const choicesContainer = document.getElementById('choices') as HTMLDivElement;
const newStoryBtn = document.querySelector('.new-story-btn') as HTMLButtonElement;
const clearChatBtn = document.querySelector('.clear-chat-btn') as HTMLButtonElement;
const themeIndicator = document.getElementById('themeIndicator') as HTMLDivElement;
const themeText = document.getElementById('themeText') as HTMLSpanElement;

// Game State Instance
let gameState: GameState = GameState.createNew();

// Initialize the app
document.addEventListener('DOMContentLoaded', function(): void {
  // Show modal on page load
  showModal();
  
  // Add event listeners
  setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners(): void {
  // Start Adventure Button
  startBtn.addEventListener('click', startAdventure);
  
  // Cancel Button (using onclick from HTML)
  // We'll define closeModal function below
    
  // New Story Button
  newStoryBtn.addEventListener('click', startNewStory);
  
  // Clear Chat Button
  clearChatBtn.addEventListener('click', clearChat);
  
  // Character counter for theme input
  adventureThemeInput.addEventListener('input', updateCharCount);
}

// Modal Functions
function showModal(): void {
  startModal.style.display = 'flex';
  adventureThemeInput.focus();
}

function closeModal(): void {
  startModal.style.display = 'none';
}

function showThemeIndicator(theme: string): void {
  // Set the theme text
  themeText.textContent = theme;
  
  // Add tooltip for long themes
  if (theme.length > 50) {
    themeIndicator.title = theme;
  }
  
  // Show the indicator with animation
  themeIndicator.style.display = 'flex';
  
  // Update theme icon based on theme type
  const themeIcon = themeIndicator.querySelector('.theme-icon') as HTMLSpanElement;
  themeIcon.textContent = getThemeIcon(theme);
}

function getThemeIcon(theme: string): string {
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTheme.includes('medieval') || lowerTheme.includes('fantasy') || lowerTheme.includes('knight')) {
    return '⚔️';
  } else if (lowerTheme.includes('sci-fi') || lowerTheme.includes('space') || lowerTheme.includes('futuristic')) {
    return '🚀';
  } else if (lowerTheme.includes('detective') || lowerTheme.includes('mystery') || lowerTheme.includes('crime')) {
    return '🔍';
  } else if (lowerTheme.includes('horror') || lowerTheme.includes('scary') || lowerTheme.includes('thriller')) {
    return '👻';
  } else if (lowerTheme.includes('western') || lowerTheme.includes('cowboy') || lowerTheme.includes('wild west')) {
    return '🤠';
  } else {
    return '🎭';
  }
}

async function startAdventure(): Promise<void> {
  let adventureTheme = adventureThemeInput.value.trim();
  
  if (!adventureTheme || adventureTheme === '') {
    const defaultAdventure = await openAIService.generateDefaultAdventure();
    adventureTheme = defaultAdventure;
  }

  // Set adventure theme
  gameState.adventureTheme = adventureTheme;
  userName.textContent = 'Adventurer';
  
  // Show theme indicator
  showThemeIndicator(adventureTheme);
  
  // Close modal
  closeModal();
  
  // Start the game
  gameState.isGameStarted = true;
  
  // Show initial choices based on theme
  const initialChoices = generateInitialChoices(adventureTheme);
  showChoices(initialChoices);
  
  // Game is now ready for choices
}

// Message Functions
function displayMessage(sender: 'user' | 'assistant', content: string): void {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender} fade-in`;
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.textContent = content;
  
  messageDiv.appendChild(messageContent);
  messages.appendChild(messageDiv);
  
  // Scroll to bottom
  scrollToBottom();
}

async function processUserChoice(choice: string): Promise<void> {
  try {
    // Get AI-generated response
    const aiResponse = await openAIService.generateStoryResponse(
      gameState.adventureTheme, 
      choice, 
      gameState.storyContext
    );
    
    // Update story context
    gameState.appendToStoryContext(`\nPlayer chose: ${choice}\nAI Response: ${aiResponse.narrative}`);
    
    // Display AI response
    setTimeout(() => {
      displayMessage('assistant', aiResponse.narrative);
      
      // Show new choices from AI
      showChoices(aiResponse.choices);
    }, 1000);
    
  } catch (error) {
    console.error('Error processing choice:', error);
    
    // Fallback response
    setTimeout(() => {
      displayMessage('assistant', 'The story continues with an unexpected twist...');
      showChoices([
        'Continue exploring',
        'Investigate further',
        'Take a different approach',
        'Follow your instincts'
      ]);
    }, 1000);
  }
}

// Choice Functions
function showChoices(choices: string[]): void {
  choicesContainer.innerHTML = '';
  
  choices.forEach(choice => {
    const choiceBtn = document.createElement('button');
    choiceBtn.className = 'choice-btn fade-in';
    choiceBtn.textContent = choice;
    choiceBtn.addEventListener('click', () => {
      // Hide choice buttons
      choicesContainer.innerHTML = '';
      
      // Process the choice
      processUserChoice(choice);
    });
    
    choicesContainer.appendChild(choiceBtn);
  });
}

// Utility Functions
function scrollToBottom(): void {
  const chatContainer = document.querySelector('.chat-container') as HTMLDivElement;
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startNewStory(): void {
  // Clear current story
  messages.innerHTML = '';
  choicesContainer.innerHTML = '';
  
  // Hide theme indicator
  themeIndicator.style.display = 'none';
  
  // Create a new game state instance
  gameState = GameState.createNew();
  
  // Show modal again
  showModal();
}

function clearChat(): void {
  if (confirm('Are you sure you want to clear the chat?')) {
    messages.innerHTML = '';
    choicesContainer.innerHTML = '';
  }
}

// Character Counter Function
function updateCharCount(): void {
  const currentLength = adventureThemeInput.value.length;
  charCount.textContent = currentLength.toString();
  
  // Change color when approaching limit
  if (currentLength > 450) {
    charCount.style.color = '#ff6b6b';
  } else if (currentLength > 400) {
    charCount.style.color = '#ffd93d';
  } else {
    charCount.style.color = '#8e8ea0';
  }
}

function generateInitialChoices(theme: string): string[] {
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTheme.includes('medieval') || lowerTheme.includes('fantasy') || lowerTheme.includes('knight')) {
    return [
      'Accept the quest from the king',
      'Visit the local tavern for information',
      'Check the castle armory for equipment',
      'Speak with the court wizard'
    ];
  } else if (lowerTheme.includes('sci-fi') || lowerTheme.includes('space') || lowerTheme.includes('futuristic')) {
    return [
      'Check the ship\'s navigation systems',
      'Investigate the emergency alert',
      'Contact the bridge crew',
      'Scan for nearby anomalies'
    ];
  } else if (lowerTheme.includes('detective') || lowerTheme.includes('mystery') || lowerTheme.includes('crime')) {
    return [
      'Visit the missing person\'s home',
      'Check the local police station',
      'Interview potential witnesses',
      'Examine the mysterious letter'
    ];
  } else if (lowerTheme.includes('horror') || lowerTheme.includes('scary') || lowerTheme.includes('thriller')) {
    return [
      'Explore the mansion\'s main hall',
      'Search for a way to turn on the lights',
      'Call out to see if anyone responds',
      'Try to find an exit'
    ];
  } else if (lowerTheme.includes('western') || lowerTheme.includes('cowboy') || lowerTheme.includes('wild west')) {
    return [
      'Join the posse to track the outlaw',
      'Visit the saloon for information',
      'Check the sheriff\'s office for clues',
      'Ride to the next town for backup'
    ];
  } else {
    // Generic choices for other themes
    return [
      'Explore the immediate surroundings',
      'Seek out local inhabitants',
      'Investigate any unusual signs',
      'Follow your instincts'
    ];
  }
}

// Make closeModal available globally for the onclick attribute
declare global {
  interface Window {
    closeModal: () => void;
  }
}

window.closeModal = closeModal; 