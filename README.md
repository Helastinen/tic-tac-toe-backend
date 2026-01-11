# Tic-Tac-Toe-Backend
Backend service for the Tic‑Tac‑Toe application.
© Antti Hellsten 2026.

# Overview
This backend provides the game logic, player state management, and API endpoints used by the Tic‑Tac‑Toe frontend. It is built with Node.js, TypeScript, and Express, and is designed to be lightweight, stateless, and easy to deploy.

The backend also serves the production‑built frontend from the dist/ directory, making it possible to deploy the entire application as a single service.

# Features
- REST API for game statistics
- TypeScript for type‑safe backend logic
- Express server with clean routing
- Environment‑based configuration using dotenv
- Production build pipeline that bundles the frontend into the backend repo
- Render‑friendly deployment setup

# Quickstart
## Prerequisites
Before running the backend, make sure you have the following:

- **Tic‑Tac‑Toe frontend application**
The backend is designed to serve the production build of the frontend from the `dist/` directory.

- **MongoDB instance for storing game statistics** 
You can use a local MongoDB server or a MongoDB Atlas cluster. The data structure is defined in the `gameHistorySchema` inside `gameHistory.ts`.

## 1. Install dependencies
`npm install`

## 2. Create a .env file
define the port and MongoDB instances:
```
PORT=3001
MONGODB_URI=<Your MongoDB connection string to production database>
MONGODB_TEST_URI=<Your MongoDB connection string to test database>
```
Example connection string: 
`mongodb+srv://myUser:myPassword@cluster0.abcd123.mongodb.net/myDatabase?`

## 3. Start the backend in development mode
Run the server using ts-node:
`npm run dev`

## 4. Build the backend (TypeScript → JavaScript)
Compile the backend into the build/ directory:
`npm run build`

## 5. Start the production server
Run the compiled backend:
`npm start`

## 6. Build the frontend and copy it into the backend
This command builds the React frontend and copies its `dist/` folder into this repo:
`npm run build:ui`