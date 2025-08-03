// Game State Class
export class GameState {
  private _adventureTheme: string;
  private _isGameStarted: boolean;
  private _currentStory: string | null;
  private _storyHistory: string[];
  private _storyContext: string;

  constructor() {
    this._adventureTheme = '';
    this._isGameStarted = false;
    this._currentStory = null;
    this._storyHistory = [];
    this._storyContext = '';
  }

  // Getters
  get adventureTheme(): string {
    return this._adventureTheme;
  }

  get isGameStarted(): boolean {
    return this._isGameStarted;
  }

  get currentStory(): string | null {
    return this._currentStory;
  }

  get storyHistory(): string[] {
    return [...this._storyHistory]; // Return copy to prevent external modification
  }

  get storyContext(): string {
    return this._storyContext;
  }

  // Setters
  set adventureTheme(theme: string) {
    this._adventureTheme = theme;
  }

  set isGameStarted(started: boolean) {
    this._isGameStarted = started;
  }

  set currentStory(story: string | null) {
    this._currentStory = story;
  }

  set storyContext(context: string) {
    this._storyContext = context;
  }

  // Methods
  addToStoryHistory(entry: string): void {
    this._storyHistory.push(entry);
  }

  appendToStoryContext(context: string): void {
    this._storyContext += context;
  }

  reset(): void {
    this._adventureTheme = '';
    this._isGameStarted = false;
    this._currentStory = null;
    this._storyHistory = [];
    this._storyContext = '';
  }

  // Factory method for creating a new game state
  static createNew(): GameState {
    return new GameState();
  }
} 