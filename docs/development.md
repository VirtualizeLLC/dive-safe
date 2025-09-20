## Development

This repository contains an in-development dive safety helper app. Everything is experimental and under active development.

### Getting started

1. Clone the repository:

   ```bash
   git clone git@github.com:VirtualizeLLC/dive-safe.git
   cd dive-safe
   ```

2. Install dependencies

   ```bash
   yarn install
   # or
   npm install
   ```

3. Generate Storybook entries (if you change story files):

   ```bash
   node ./scripts/generate-story-entries.js
   ```

   We recommend adding a watch script during development to regenerate entries automatically.

4. Start the app (Expo):

   ```bash
   npx expo start
   ```

5. Open on a simulator or device using the Expo UI.


### Development workflow

- App code lives under `app/` and components under `components/`.
- Storybook stories live under `components/**/*.stories.*`.
- The project uses TypeScript and Biome/ESLint for linting.
- Use the `scripts/` utilities for maintenance tasks. Example: `scripts/generate-story-entries.js` scans `components/` and produces `storybook/entries.js` for native Storybook.


### Storybook and UI testing

- Run the Storybook dev server for web UI testing:

  ```bash
  yarn storybook
  ```

- For on-device Storybook in React Native, use the in-app Storybook entry. If stories don't appear, run the generator above and restart Metro.