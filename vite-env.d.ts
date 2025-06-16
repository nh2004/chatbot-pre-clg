// src/vite-env.d.ts

/// <reference types="vite/client" /> // <-- THIS LINE IS CRUCIAL

interface ImportMetaEnv {
  // Vite includes some default ones like this:
  readonly VITE_APP_TITLE: string;

  // Add all your custom environment variables here,
  // making sure they start with VITE_
  readonly VITE_API_KEY: string;
  readonly VITE_BASE_URL: string;
  // ... any other VITE_ variables you have in your .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}