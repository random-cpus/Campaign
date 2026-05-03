# Technical Architecture & Technology Stack

This document outlines the technologies used to build the Resilience Media Campaign Management Dashboard, along with their specific roles within the architecture.

## 1. Frontend Framework: React 19 & Vite
- **React 19**: Used as the core library for building the user interface. It allows us to build encapsulated, reusable components (like the Campaign Dashboard and Modals) that manage their own state. React's virtual DOM ensures fast UI updates when campaign data changes.
- **Vite**: Used as the build tool and development server. Vite provides extremely fast Hot Module Replacement (HMR) during development and highly optimized static asset bundling for production, resulting in a lightweight and lightning-fast web application.

## 2. Language: TypeScript
- **TypeScript**: A superset of JavaScript that adds static typing. By defining precise interfaces (e.g., `Campaign`), TypeScript catches errors at compile-time rather than runtime. This ensures that the data moving between the backend and frontend is highly predictable, making the codebase robust and easier to maintain.

## 3. Styling & UI Design
- **Vanilla CSS (with CSS Variables)**: The application uses a custom, premium design system built with standard CSS. CSS variables (`:root`) are used to manage the color palette, spacing, and glassmorphism effects, ensuring a consistent, modern "dark mode" aesthetic without the overhead of massive CSS frameworks.
- **Lucide-React**: A lightweight icon library used throughout the application (e.g., Shield, Play, Pause, Trash icons). SVG icons ensure crisp rendering on all screen sizes and keep the bundle size small.
- **Google Fonts (Outfit)**: A modern, geometric sans-serif typeface used to give the application a premium, "pro developer" aesthetic.

## 4. Routing & State Management
- **React Router v7**: Used for handling client-side routing. It enables the seamless transition between the `/login` page and the main `/` dashboard without requiring full page reloads, creating a smooth Single Page Application (SPA) experience.
- **Context API (AuthContext)**: React's built-in Context API is used to manage global authentication state. It wraps the entire application, ensuring that secure routes (`PrivateRoute`) can instantly verify if a user is logged in or redirect them to the login portal.

## 5. Security & Proxy Layer: Vercel Serverless Functions
- **Vercel Node API (`api/proxy.ts`)**: Acts as a secure intermediary layer between the React frontend and the external tracking backend (`trk.resiliencemedia.tech`).
- **Why a Proxy?**
  1. **CORS Mitigation**: Prevents Cross-Origin Resource Sharing errors by having the browser communicate with the Vercel domain, while Vercel communicates with the backend.
  2. **Credential Hiding**: The Vercel function securely holds the `API_AUTH_KEY` environment variable. The frontend *never* sees this key, making it impossible for malicious actors to scrape it.
- **Cookie-based Sessions**: Uses the `cookie` library and native Node.js `crypto` to create secure, HTTP-only, cryptographically signed session cookies upon login. This ensures maximum protection against cross-site scripting (XSS) attacks.

## 6. Hosting & Deployment: Vercel
- **Vercel Infrastructure**: The platform hosts both the static frontend assets and the serverless API routes. It automatically manages scaling, provides free SSL/HTTPS, and reads the securely injected environment variables.
