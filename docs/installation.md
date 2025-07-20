# Installation Guide

This guide will walk you through the process of setting up and running the OnboardAI application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (usually comes with Node.js)
- A text editor of your choice (VS Code recommended)
- An OpenAI API key

## Installation Steps

### 1. Clone the Repository

```bash
git clone [repository-url]
cd hackathon-csw
```

### 2. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

⚠️ **Important**: Never commit your `.env` file to version control. The `.gitignore` file should already be configured to exclude it.

### 4. Start the Development Server

Run the development server with:

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

### 5. Access the Application

- Chat Interface: http://localhost:5173/
- Admin Dashboard: http://localhost:5173/admin

## Build for Production

To create a production build:

```bash
npm run build
```

This will generate optimized assets in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

### API Key Issues

If you see "API Key Required" in the application:

1. Check that your `.env` file exists and contains the correct environment variable name (`VITE_OPENAI_API_KEY`)
2. Verify your API key is valid and has access to the required models
3. Restart the development server after making changes to the `.env` file

### IndexedDB Issues

If document storage in the admin dashboard isn't working:

1. Check that your browser supports IndexedDB
2. Try clearing browser data for the site
3. Look for error messages in the browser console

### Browser Compatibility

The application is designed to work with modern browsers. If you encounter issues:

1. Update your browser to the latest version
2. Try a different browser like Chrome, Firefox, or Edge
3. Check the browser console for specific error messages
