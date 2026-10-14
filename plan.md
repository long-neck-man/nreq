To develop a local library and test it in a separate frontend application simultaneously, the absolute best tool for the job is a pnpm Monorepo (Workspaces).
Instead of dealing with buggy npm link commands or constantly publishing test versions to npm, a monorepo allows your frontend to automatically pull live, instant updates from your library as you write code.
Here is the complete blueprint to set up this workspace.
## 1. Structure Your Directory
Create a single root folder to hold both projects:

my-project/
├── apps/
│   ├── nodereq-ui/
├── packages
│   ├── nodereq-pipeline/
├── package.json
└── pnpm-workspace.yaml

## 2. Initialize the Workspace
Run these commands in your terminal to create the directories and configuration files:

mkdir my-project && cd my-project
pnpm init
touch pnpm-workspace.yaml

Open pnpm-workspace.yaml and define where your packages live:

packages:
  - 'packages/*'

## 3. Set Up the Library (packages/core-lib)
Navigate into a new folder for your library and configure it using tsup (the fastest tool for bundling libraries).

mkdir -p packages/core-lib && cd packages/core-lib
pnpm init
pnpm add -D typescript tsup @types/node
pnpm exec tsc --init

Update packages/core-lib/package.json:

{
  "name": "@my-project/core-lib",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  }
}

Create a file at packages/core-lib/src/index.ts and add a dummy function:

export const greet = (name: string) => `Hello from the library, ${name}!`;

## 4. Set Up the Frontend (packages/frontend)
Go back to the root, and spin up a quick frontend using Vite (e.g., React + TypeScript):

cd ../..
pnpm create vite packages/frontend --template react-ts

## 5. Link the Library to the Frontend
This is where the pnpm magic happens. Tell your frontend to use your local library by running this command from the root directory:

pnpm --filter frontend add @my-project/core-lib@workspace:*

Look at your packages/frontend/package.json. You will see it linked securely:

"dependencies": {
  "@my-project/core-lib": "workspace:*"
}

## 6. Use the Library in the Frontend
Open packages/frontend/src/App.tsx and import your library just like a regular npm package:

import { greet } from '@my-project/core-lib';
function App() {
  return (
    <div>
      <h1>{greet("Developer")}</h1>
    </div>
  );
}export default App;

## 7. Running Development Mode
To develop smoothly, you want the library to rebuild whenever you make changes, and the frontend to hot-reload immediately. Add this script to your root package.json:

"scripts": {
  "dev": "pnpm -r --parallel dev"
}

Now, simply run pnpm dev in the root directory. You can edit your library code, and the changes will instantly reflect in your running frontend browser window.
To refine this workflow for your specific stack, let me know:

* What frontend framework are you planning to use (React, Vue, Svelte, Vanilla JS)?
* Will your library need to handle CSS/styles or assets, or is it purely logical functions/utilities?
* Are you planning to keep these in a single Git repository (monorepo) long-term, or do they absolutely need to live in two completely separate Git repositories?
