# Vuetex

**Vuetex** is a demo web project built with **Vue 3** and **Quasar Framework**.
It presents a dark Matrix-inspired interface and includes an integrated AI assistant for Vue, Quasar, and frontend development topics.

## Overview

Vuetex is not just a static demo website.
It demonstrates a modern frontend interface with an embedded AI chat widget connected to an external AI gateway.

The project is focused on:

- Vue 3 frontend development
- Quasar Framework UI patterns
- responsive SPA architecture
- Matrix-inspired visual design
- AI assistant integration
- code-friendly chat interface
- frontend-only AI gateway communication

## AI Assistant

The site includes a custom AI chat widget:

**VX://AI TERMINAL**
**AI Assistant for Vue & Quasar**

The assistant is designed as a frontend developer helper focused mainly on:

- Vue.js
- Quasar Framework
- Composition API
- Pinia
- Vue Router
- TypeScript
- component architecture
- API integration
- UI/UX
- frontend performance
- deployment questions

The assistant can also answer general questions, but its primary style and context are oriented toward Vue and Quasar development.

## Chat Features

The integrated AI chat includes:

- floating animated launcher
- Matrix / terminal-style interface
- full chat history context
- system prompt injection per request
- Markdown rendering
- syntax-highlighted code blocks
- copy button for code blocks
- copy / regenerate / like / dislike actions under assistant answers
- export chat to text file
- clear chat confirmation
- loading overlay with Matrix-style transmission messages
- graceful error message when AI connection is unavailable

## Architecture

Vuetex is a **frontend-only** project.

There is no local backend in this repository.

The chat widget communicates with an existing external AI gateway:

text
Vuetex Frontend
↓
AI Chat Widget
↓
EVAISYS AI Chat Gateway
↓
LLM Provider

The backend endpoint is configured in:

src/config/aiConfig.js

## Example configuration:

export const AI_CONFIG = {
baseUrl: 'https://evaisys-backend.onrender.com',
chatPath: '/chat',
clientId: 'vuetex',
clientToken: '...'
}

## Tech Stack

Vue 3
Quasar Framework
Vue Router
Pinia
Axios / Fetch-based API communication
SCSS
Markdown rendering for AI responses

## Project Structure

src/
├── components/
│ ├── Chat/
│ │ └── ChatWidget.vue
│ ├── Items/
│ └── Navigations/
├── config/
│ └── aiConfig.js
├── css/
├── layouts/
│ └── MainLayout.vue
├── pages/
├── router/
└── stores/
Local Development

## Install dependencies:

npm install

## Run the development server:

npm run dev

## Build for production:

npm run build

## Notes

This project is intended as a portfolio/demo project showing how a Vue + Quasar frontend can be combined with an AI-powered assistant while preserving a strong custom visual identity.

The AI gateway is external and shared with other demo projects.
Backend implementation is intentionally out of scope for this repository.

## Status

Current version includes a working AI chat widget with Matrix-inspired visual styling and developer-oriented chat features.
