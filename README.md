# KopX AI Chat Interface

A stunning 3D AI chat interface built with React, TypeScript, and Tailwind CSS.

## Features

- 🧠 **Advanced AI Reasoning**: Powered by DeepSeek v3.1 with real-time reasoning display
- 🔍 **Web Search Integration**: 4-step search process using Serper.dev API
- 🎨 **3D Visual Effects**: Floating particles, glass-morphism, and smooth animations
- 🎭 **Dual Personality Modes**: Regular (analytical) and Fun (humorous) modes
- 📱 **Responsive Design**: Optimized for all screen sizes
- 🔒 **Secure**: API keys stored in environment variables

## Setup for Vercel Deployment

To deploy this application on Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```
VITE_OPENROUTER_API_KEY=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
VITE_SERPER_API_KEY=a349485f082589e96ee381698f345cb22fe9ed4a
```

### How to Add Environment Variables in Vercel:

1. **Log into Vercel Dashboard**
2. **Select your project**
3. **Go to Settings tab**
4. **Click on Environment Variables**
5. **Add each variable:**
   - Name: `VITE_OPENROUTER_API_KEY`
   - Value: `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`
   - Environment: Production, Preview, Development
   
   - Name: `VITE_SERPER_API_KEY`
   - Value: `a349485f082589e96ee381698f345cb22fe9ed4a`
   - Environment: Production, Preview, Development

6. **Redeploy your application** after adding the variables

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the environment variables above
4. Start development server: `npm run dev`

## Architecture

- **Background3D**: Stunning 3D particle system with depth and connections
- **ChatInterface**: Main chat UI with mode selection and input handling
- **MessageBubble**: Individual message display with reasoning toggle
- **ReasoningPanel**: Side panel showing AI's thinking process
- **ModeSelector**: Toggle between Regular and Fun personality modes
- **OpenRouter Service**: API integration with error handling and search optimization

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- OpenRouter API (DeepSeek v3.1)
- Serper.dev for web search
- Lucide React for icons