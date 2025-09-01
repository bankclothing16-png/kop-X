import React, { useState } from 'react';
import { User, Brain, Search, Copy, Check } from 'lucide-react';
import { Message } from '../types';

interface Props {
  message: Message;
  showReasoning: boolean;
}

export const MessageBubble: React.FC<Props> = ({ message, showReasoning }) => {
  const [copied, setCopied] = useState(false);
  const [showReasoningDetails, setShowReasoningDetails] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (content: string) => {
    // Remove markdown artifacts like ** and //
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\/\/(.*?)\/\//g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1');
  };

  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          {message.isSearchResult ? <Search className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
        </div>
      )}
      
      <div className={`max-w-2xl ${message.type === 'user' ? 'order-first' : ''}`}>
        <div
          className={`p-4 rounded-2xl backdrop-blur-sm border ${
            message.type === 'user'
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/30 text-white'
              : 'bg-white/10 border-white/20 text-gray-100'
          } hover:shadow-lg transition-all duration-300`}
        >
          <div className="whitespace-pre-wrap">{formatContent(message.content)}</div>
          
          {message.type === 'assistant' && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                {message.reasoning && showReasoning && (
                  <button
                    onClick={() => setShowReasoningDetails(!showReasoningDetails)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showReasoningDetails ? 'Hide' : 'Show'} Reasoning
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
          
          {message.reasoning && showReasoning && showReasoningDetails && (
            <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400 mb-2">AI Reasoning:</div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">{message.reasoning}</div>
            </div>
          )}
        </div>
      </div>

      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};