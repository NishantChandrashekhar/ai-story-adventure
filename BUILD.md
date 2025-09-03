# Build Configuration

This project uses a clean separation between client and server builds to eliminate redundancy.

## Build Structure

### Server Build (`tsconfig.json`)
- **Input**: `src/**/*.ts` (excluding client files)
- **Output**: `dist/` folder
- **Contains**: Server-side code (Express app, routes, controllers, services)
- **Module System**: CommonJS (Node.js compatible)

### Client Build (`tsconfig.client.json`)
- **Input**: `src/client/**/*.ts`
- **Output**: `public/js/` folder
- **Contains**: Client-side code (browser JavaScript)
- **Module System**: ES Modules (browser compatible)

## Build Commands

```bash
# Clean all build artifacts
npm run clean

# Build server code only
npm run build:server

# Build client code only
npm run build:client

# Build everything (clean + server + client)
npm run build

# Watch mode for development
npm run watch
```

## File Locations

- **Source Code**: `src/` folder
- **Server Build**: `dist/` folder
- **Client Build**: `public/js/` folder
- **Static Assets**: `public/` folder

## Why This Structure?

1. **No Redundancy**: Client and server files are built to separate locations
2. **Clear Separation**: Server code runs on Node.js, client code runs in browsers
3. **Proper Serving**: Client files in `public/js/` can be served by Express static middleware
4. **Clean Builds**: Each build process has its own output directory
