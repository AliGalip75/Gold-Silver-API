# AurumArgent Mobile App - Agent Directives

## 1. General Core Rules

- **CRITICAL:** ALL code comments, docstrings, and commit messages MUST be written strictly in ENGLISH.
- Write concise, modular, and DRY (Don't Repeat Yourself) code.
- Avoid unnecessary abstractions. Keep the architecture flat and understandable.

## 2. Tech Stack & Architecture

- **Framework:** Expo (Development Builds / Custom Dev Client). **STRICT RULE: NO EXPO GO.**
- **Routing:** Expo Router (File-based routing via the `/app` directory).
- **Styling:** NativeWind (Tailwind CSS for React Native).
- **State Management:** Zustand.
- **Data Fetching:** React Query (@tanstack/react-query) + Axios.
- **Storage:** react-native-mmkv.
- **Lists:** @shopify/flash-list.

## 3. Theming & UI Rules

- Implement strict Global Color Management using `global.css`, `tailwind.config.ts`, and a centralized `theme.ts`.
- The app MUST support system-based and user-toggled Dark/Light Mode.
- UI elements must look modern and premium but remain lightweight. Use `react-native-reanimated` for smooth, non-blocking UI transitions.

## 4. Performance Guidelines (For Older Devices)

- Prevent unnecessary re-renders (use `useMemo`, `useCallback`, and `React.memo` where appropriate).
- Offload heavy calculations from the JS thread.

## 5. Directory Structure Strategy

- Use Expo Router's `/app` for routing and screens.
- Keep the rest of the logic Feature-Driven in `/src`:
  - `/app`: Expo Router screens, layouts (`_layout.tsx`), and global providers.
  - `/src/core`: Global configurations, API instances (Axios), NativeWind/Theme setup.
  - `/src/shared`: Truly reusable UI components (Buttons, Loaders, Typography) and global hooks.
  - `/src/features`: The core of the app. Grouped by domain (e.g., `/features/prices`, `/features/ads`).
    - Inside a feature: `/components`, `/api` (React Query hooks), `/store` (Zustand slices), `/types`.
