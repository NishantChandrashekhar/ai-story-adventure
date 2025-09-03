# JavaScript Architecture

This directory contains the modular JavaScript architecture for the Story Teller application.

## File Structure

```
js/
├── main.js      # Application entry point and initialization
├── state.js     # State management and data flow
├── api.js       # API communication layer
├── ui.js        # DOM manipulation and UI updates
├── events.js    # Event handling and business logic
└── README.md    # This documentation
```

## Architecture Overview

### 1. **State Management (`state.js`)**
- Centralized application state using a simple observer pattern
- Manages: choices, narrative, theme, loading state, messages
- Provides subscription mechanism for reactive UI updates
- Immutable state updates with proper change notifications

### 2. **API Layer (`api.js`)**
- Handles all backend communication
- Centralized error handling
- Consistent request/response formatting
- Easy to extend with new endpoints

### 3. **UI Module (`ui.js`)**
- All DOM manipulation and rendering logic
- Centralized element references
- Consistent UI update patterns
- Loading states and animations

### 4. **Event Handling (`events.js`)**
- Business logic and event listeners
- Uses event delegation for better performance
- Handles user interactions and API calls
- Manages application flow

### 5. **Main Application (`main.js`)**
- Application initialization and lifecycle
- Module coordination
- Entry point for the application

## Key Benefits

### **Scalability**
- Easy to add new features by extending existing modules
- Clear separation of concerns
- Modular structure allows for easy testing

### **Maintainability**
- Single responsibility principle
- Clear data flow from state → UI
- Consistent error handling

### **Performance**
- Event delegation for dynamic elements
- Efficient state updates with change detection
- Minimal DOM manipulation

### **Developer Experience**
- Clear module boundaries
- Easy debugging with centralized state
- Consistent patterns across the codebase

## Usage Examples

### Adding a New Feature

1. **Add state** in `state.js`:
```javascript
// Add new state property
this.state = {
  // ... existing state
  newFeature: null
};

// Add setter method
setNewFeature(value) {
  this.setState({ newFeature: value });
}
```

2. **Add UI methods** in `ui.js`:
```javascript
updateNewFeature(value) {
  // Update DOM elements
}
```

3. **Add event handling** in `events.js`:
```javascript
handleNewFeature() {
  // Business logic
  appState.setNewFeature(value);
  ui.updateNewFeature(value);
}
```

### Adding a New API Endpoint

1. **Add method** in `api.js`:
```javascript
async newEndpoint(data) {
  return this.request('/new-endpoint', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

2. **Use in events.js**:
```javascript
const response = await storyAPI.newEndpoint(data);
```

## Migration from Original Structure

The original `main.js` has been refactored into this modular structure:

- **Event listeners** → `events.js`
- **DOM manipulation** → `ui.js`
- **API calls** → `api.js`
- **State management** → `state.js`
- **Initialization** → `main.js`

## Future Enhancements

- Add TypeScript for better type safety
- Implement proper error boundaries
- Add unit tests for each module
- Consider adding a build step for optimization
- Add logging and analytics
