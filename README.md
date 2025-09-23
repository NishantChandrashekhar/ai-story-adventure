# AI Story Adventure

An interactive story adventure app powered by OpenAI. The backend is written in TypeScript (compiled to `dist/`), and the frontend is a modular vanilla JS app served from `public/`.

## Features

- **Interactive storytelling**: Dynamic story generation based on user choices
- **Theme-based adventures**: Provide any theme; the AI adapts
- **Modern chat UI**: Chat-style interface with choices
- **Context awareness**: Remembers previous choices to continue the narrative

## Prerequisites

- Node.js 18+ recommended
- An OpenAI API key with access to chat completion models

## Setup

1) Install dependencies

```bash
npm install
```

2) Environment variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-...          # required
MAX_TOKENS=500                 # optional; default 500
TEMPERATURE=0.8                # optional; default 0.8
PORT=3000                      # optional; default 3000
```

Note: The model defaults to `gpt-3.5-turbo` in code. There is no `OPENAI_MODEL` variable currently read from the environment.

## Build and Run

The codebase is TypeScript-first. Build both server and client, then run the compiled server.

```bash
# Clean previous builds and compile server (src → dist) and client (src/client → public/js)
npm run build

# Start the server from compiled output
node dist/app.js
```

Then open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run clean` – remove `dist/` and `public/js/`
- `npm run build:server` – compile server TS per `tsconfig.json` → `dist/`
- `npm run build:client` – compile client TS per `tsconfig.client.json` → `public/js/`
- `npm run build` – clean, then build server and client

Tip: A `dev` script exists but points to a non-existent entry; prefer the build/run flow above or add your own dev script using `nodemon` or `ts-node` if desired.

## API

Base URL: `/api`

- POST `/api/story`
  - Body: `{ "theme": string }`
  - Response: `{ narrative: string, choices: string[] }`
  - Behavior: Resets session context, sets story theme, returns the opening narrative and four choices.

- POST `/api/story/choice`
  - Body: `{ "choice": string }`
  - Response: `{ narrative: string, choices: string[] }`
  - Behavior: Continues the story based on the choice and returns the next narrative and choices.

Errors are returned as `{ error: string }` with appropriate HTTP status codes.

## Frontend

The frontend is served from `public/` and uses compiled modules in `public/js/`:

- `public/index.html` – main page
- `public/js/main.js` – app bootstrap
- `public/js/api.js` – API layer (base `/api`)
- `public/js/state.js` – app state (choices, narrative, messages)
- `public/js/ui.js` – DOM updates
- `public/js/events.js` – event handlers

Open `http://localhost:3000` and click “Begin Adventure” to start. The theme you enter initializes the story; subsequent button clicks send your choices to the backend.

## How It Works

- Server: `src/app.ts` mounts static `public/`, parses JSON, and registers `src/routes/story.ts` at `/api/story`.
- LLM: `src/llm/openai-service.ts` orchestrates calls to OpenAI Chat Completions, tracks minimal history, and parses a strict output format into `{ narrative, choices }`.
- Story type: `src/llm/short-story.ts` defines role instructions and staged prompts to guide story progression over multiple turns.

For a deeper dive, see `docs/LLM.md`.

## Project Structure

```
├── src/
│   ├── app.ts                      # Express server (TS)
│   ├── routes/story.ts             # /api/story routes
│   ├── controllers/storyController.ts
│   └── llm/
│       ├── openai-service.ts       # OpenAI client and parsing
│       ├── short-story.ts          # Story prompt strategy
│       └── story-type.ts           # Base class for story types
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── js/                         # built client JS (from src/client)
│
├── dist/                           # built server JS (from src)
├── tsconfig.json                   # server TS config
├── tsconfig.client.json            # client TS config
└── package.json
```

## Security

- Never commit `.env` or API keys
- Limit `MAX_TOKENS` and set sensible `TEMPERATURE`
- For production, set environment variables securely and run behind HTTPS

## Troubleshooting

- 401/403 from OpenAI: verify `OPENAI_API_KEY`
- Empty story/choices: ensure the model is available to your key and that outbound network access is allowed
- Frontend not updating: confirm client build exists in `public/js/` (rerun `npm run build`)

## License

MIT. See `LICENSE`.
