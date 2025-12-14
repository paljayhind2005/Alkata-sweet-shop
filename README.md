

🌟 Alkata Sweet Shop Management System

A modern, full-featured Sweet Shop Management System built using Astro, React, TypeScript, Tailwind CSS, and a clean component-driven architecture.
This project is created as part of the Incubyte TDD Kata Assignment, following clean code, modular design, and AI-augmented development practices.

🚀 Features
🧩 Core Features

Sweet Item Management – Add, update, delete, and view sweet items.

Inventory Overview – Manage stock levels and availability.

Order Management – Create and manage customer orders.

Responsive UI – Mobile-first, smooth, and modern design.

Testing Suite – Vitest-based unit tests.

🛠️ Technical Features

Astro Framework – Static + server rendering support

React Components – Interactive UI with JSX

TypeScript – Strong typing and maintainable code

Tailwind CSS – Utility-first styling with custom components

Radix UI – Accessible and customizable UI components

Zustand – Lightweight state management

React Hook Form + Zod – Form handling and schema validation

Vite – Super-fast build tool

Cloudflare Deployment – Optimized for edge deployment

🛠️ Tech Stack
Category	Technology
Frontend	React 18.3.0
Language	TypeScript 5.8.3
Styling	Tailwind CSS 3.4.14
UI Toolkit	Radix UI
State Management	Zustand
Validation	Zod + React Hook Form
Testing	Vitest
Build Tool	Vite
Deployment	Cloudflare
🚀 Getting Started
✔ Prerequisites

Node.js 18+

npm or yarn

Git installed

✔ Installation
1️⃣ Install dependencies
npm run install-template

2️⃣ Set up environment variables
npm run env

3️⃣ Start development server
npm run dev


The project will run at:
👉 http://localhost:4321

📁 Project Structure
main/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Head.tsx         # <head> component
│   │   └── Router.tsx       # Routing logic
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Helper functions
│   ├── pages/               # Astro pages
│   └── styles/              # Global styles
├── integrations/            # External services
│   ├── cms/                 # CMS integration
│   └── members/             # Authentication
├── public/                  # Static files
└── eslint-rules/            # Lint rules

🎨 UI Components

Includes a full set of reusable UI elements:

Buttons, Cards, Badges

Forms (Input, Select, Switch, Checkbox, Radio)

Overlays (Dialog, Tooltip, Popover)

Navigation (Menus, Tabs, Breadcrumbs)

Data display (Table, Skeleton, Progress)

🔧 Available Scripts
Script	Description
npm run dev	Start dev server
npm run build	Generate production build
npm run preview	Preview build
npm run test:run	Run Vitest
npm run release	Deploy to Wix
npm run env	Load environment variables
npm run check	Type check
npm run install-template	Install dependencies
🧪 Testing

Run the complete test suite:

npm run test:run


A full report will be generated inside the terminal.

📸 Screenshots (Add your actual screenshots here)
/screenshots/homepage.png  
/screenshots/manage-items.png  
/screenshots/orders.png  
/screenshots/mobile-responsive.png  

🌐 Deployment

To create a production build:

npm run build


Deploy easily to Cloudflare, Vercel, or Netlify.

🤝 Contributing

Fork the repo

Create a new feature branch

Commit changes

Run tests

Open a Pull Request

🔥 My AI Usage (Mandatory Section)

This project was developed with responsible and transparent use of AI tools. Below is the detailed breakdown of how AI assisted my workflow.

✔ AI Tools Used

ChatGPT (OpenAI)

GitHub Copilot

Gemini (Google)

✔ How I Used AI

Project Ideation & Structure

Used ChatGPT to brainstorm project folder structure and component architecture.

Asked for guidance on selecting tech stack (React + Astro + Tailwind).

Code Assistance

Used GitHub Copilot to auto-complete React components and utility functions.

Used AI to generate initial versions of repetitive UI elements (buttons, cards, inputs).

Debugging & Optimization

Asked ChatGPT to explain Astro build errors and TypeScript issues.

Used AI suggestions to improve state management with Zustand and validation with Zod.

Documentation

README.md initial draft and refinement written with AI support.

AI helped me rewrite instructions in a more professional format.

Testing Support

Used AI to help generate sample Vitest test cases, which I customized and refined manually.

✔ Impact of AI on My Workflow (Reflection)

AI significantly increased development speed, especially for boilerplate code.

Helped me learn faster—especially on integrating Astro + React.

Improved code consistency and readability.

However, all logic, architecture decisions, and core implementation were written by me to ensure full understanding and originality.

AI acted as a coding partner, not as a replacement.
