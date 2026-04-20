# Focus & Flow - Life Ledger

A meditative, highly organized personal dashboard for tracking lifegoals, reading, and reflections. Built with a "Natural Tones" aesthetic to provide a calming and productive space.

## Features

- **Daily Focus & Goals**: Organize priorities by category and timeframe.
- **Reading Tracker**: Manage your personal library with a featured focus on your current read.
- **Journal/Ledger**: Capture daily reflections in a distraction-free editorial interface with export support (TXT/JSON).
- **Persistent Storage**: Uses a hybrid approach—Browser Local Storage for quick access and a local `ledger.json` file for permanent storage during development.

## Data Persistence & Local File Storage

This application includes a full-stack local server that can save your data directly to a file on your disk (`ledger.json`).

1.  **Automatic Sync**: When running locally with `npm run dev`, any changes you make are debounced and saved to `ledger.json`.
2.  **Startup Loading**: The app automatically checks for a `ledger.json` file when it starts and populates your dashboard.
3.  **Cross-Platform Fallback**: If you deploy this to a static host (like GitHub Pages), it will gracefully fall back to Browser Local Storage only.

## Local Setup Instructions

Follow these steps to run the application on your local machine:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18 or higher is recommended).

### 2. Installation

Clone or download the project files to your local machine, then open your terminal in the project root and run:

```bash
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to create a `.env` file:

**Bash:**
```bash
cp .env.example .env
```

**PowerShell:**
```powershell
Copy-Item .env.example .env
```

If you plan to use AI features (if implemented in the current version), add your Gemini API key to the `.env` file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

*Note: For local development with Vite, variables must be prefixed with `VITE_` to be accessible in the client.*

### 4. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

Once started, the application will be accessible at:
[http://localhost:3000](http://localhost:3000)

### 5. Production Build

To create a production-optimized build:

```bash
npm run build
```

The static files will be generated in the `dist` folder, which can then be served using any static host (like Vercel, Netlify, or `npx serve dist`).

### 6. Deploying to GitHub Pages

The project is configured for easy deployment to GitHub Pages using the `gh-pages` package.

1.  Initialize a git repository in your project folder (if you haven't already):
    ```bash
    git init
    git remote add origin https://github.com/your-username/your-repo-name.git
    ```
2.  Deploy the application:
    ```bash
    npm run deploy
    ```
    This will build the project and push the `dist` folder to a `gh-pages` branch on your repository.
3.  In your GitHub repository settings, go to **Pages** and ensure the source is set to the `gh-pages` branch.

## Troubleshooting Local Errors

If you see errors like **"Cannot find module 'react'"** or similar issues in your IDE (like VS Code), try the following:

1.  **Re-run Install**: Ensure all dependencies are correctly linked.
    ```bash
    npm install
    ```
2.  **Restart TS Server**: In VS Code, open a `.tsx` file, press `Ctrl+Shift+P` (or `Cmd+Shift+P`), and type **"TypeScript: Restart TS Server"**.
3.  **Check Node Version**: Ensure you are using Node.js v18+.
4.  **Clean Dependencies**: If errors persist, delete your `node_modules` and `package-lock.json` and reinstall:
    ```bash
    # Bash
    rm -rf node_modules package-lock.json && npm install
    
    # PowerShell
    Remove-Item -Recurse -Force node_modules, package-lock.json; npm install
    ```

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Persistence**: LocalStorage (via custom hooks)

## Design Aesthetics

The **Natural Tones** theme utilizes:
- **Serif Font**: Cormorant Garamond (Imported via Google Fonts)
- **Sans-Serif Font**: Inter
- **Palette**: `#6B705C` (Olive), `#A5A58D` (Sage), `#B7B7A4` (Pale), `#FFE8D6` (Soft), `#D4A373` (Tan).
