import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Background3D } from './components/Background3D';
import { ChatInterface } from './components/ChatInterface';
import { Message, ChatConfig } from './types';
import { chatWithAI, searchWeb, generateSearchQuery } from './services/openrouter';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<ChatConfig>({
    mode: 'regular',
    showReasoning: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState('');

  const handleSendMessage = useCallback(async (content: string, useSearch: boolean) => {
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentReasoning('Analyzing your question and determining the best approach...');

    try {
      let searchResults;
      let finalContent = content;

      if (useSearch) {
        setCurrentReasoning('Optimizing search query for better results...');
        
        // Step 1: Optimize search query
        const optimizedQuery = await generateSearchQuery(content, config.mode);
        
        setCurrentReasoning(`Searching the web for: "${optimizedQuery}"...`);
        
        // Step 2: Search the web
        searchResults = await searchWeb(optimizedQuery);
        
        if (searchResults.length > 0) {
          setCurrentReasoning('Processing search results and formulating response...');
        } else {
          setCurrentReasoning('No search results found, providing response based on my knowledge...');
        }
      } else {
        setCurrentReasoning('Processing your request using my knowledge base...');
      }

      // Step 3 & 4: Generate AI response
      const aiResponse = await chatWithAI(finalContent, config.mode, searchResults);
      
      const assistantMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: aiResponse.content,
        reasoning: aiResponse.reasoning || currentReasoning,
        timestamp: new Date(),
        isSearchResult: useSearch && searchResults && searchResults.length > 0
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      
      let errorContent = 'I apologize, but I encountered an error processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorContent = 'Configuration Error: API keys are not properly set up. Please check your environment variables.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          errorContent = 'Network Error: Unable to connect to AI services. Please check your internet connection and try again.';
        } else if (error.message.includes('401')) {
          errorContent = 'Authentication Error: Invalid API key. Please check your OpenRouter API key configuration.';
        } else if (error.message.includes('429')) {
          errorContent = 'Rate Limit Error: Too many requests. Please wait a moment and try again.';
        } else if (error.message.includes('500')) {
          errorContent = 'Server Error: The AI service is temporarily unavailable. Please try again later.';
        } else {
          errorContent = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: errorContent,
        reasoning: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentReasoning('');
    }
  }, [config.mode, currentReasoning]);

  const handleConfigChange = useCallback((newConfig: ChatConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <Background3D />
      <ChatInterface
        messages={messages}
        config={config}
        isLoading={isLoading}
        currentReasoning={currentReasoning}
        onSendMessage={handleSendMessage}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}

export default App;