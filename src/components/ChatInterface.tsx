import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Brain, Sparkles, MessageSquare, Settings } from 'lucide-react';
import { Message, ChatConfig } from '../types';
import { MessageBubble } from './MessageBubble';
import { ReasoningPanel } from './ReasoningPanel';
import { ModeSelector } from './ModeSelector';

interface Props {
  messages: Message[];
  config: ChatConfig;
  isLoading: boolean;
  currentReasoning: string;
  onSendMessage: (message: string, useSearch: boolean) => void;
  onConfigChange: (config: ChatConfig) => void;
}

export const ChatInterface: React.FC<Props> = ({
  messages,
  config,
  isLoading,
  currentReasoning,
  onSendMessage,
  onConfigChange
}) => {
  const [input, setInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), showSearch);
      setInput('');
      setShowSearch(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="backdrop-blur-lg bg-white/10 border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KopX
                </h1>
                <p className="text-sm text-gray-300">
                  {config.mode === 'regular' ? 'Analytical Mode' : 'Fun Mode'} • DeepSeek v3.1
                </p>
              </div>
            </div>
            <ModeSelector config={config} onConfigChange={onConfigChange} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to KopX</h2>
              <p className="text-gray-300 mb-6 max-w-md">
                Your advanced AI companion with reasoning capabilities and web search integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {[
                  'Explain quantum computing',
                  'Search for latest AI developments',
                  'Help me write creative content',
                  'Analyze complex problems'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left text-sm text-gray-300 transition-all hover:border-blue-400/30"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} showReasoning={config.showReasoning} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                </div>
                <span>KopX is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="backdrop-blur-lg bg-white/10 border-t border-white/20 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message KopX..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 pr-12"
              />
            </div>
            
            {/* Search Button */}
            <button
              type="button"
              onClick={() => {
                if (input.trim() && !isLoading) {
                  onSendMessage(input.trim(), true);
                  setInput('');
                }
              }}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
              title="Search the web"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Search</span>
            </button>
            
            {/* Regular Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              title="Send message"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Reasoning Panel */}
      {config.showReasoning && (
        <ReasoningPanel reasoning={currentReasoning} isVisible={config.showReasoning} />
      )}
    </div>
  );
};