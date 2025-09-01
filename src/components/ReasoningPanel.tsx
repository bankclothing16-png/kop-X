import React from 'react';
import { Brain, X } from 'lucide-react';

interface Props {
  reasoning: string;
  isVisible: boolean;
}

export const ReasoningPanel: React.FC<Props> = ({ reasoning, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="w-80 backdrop-blur-lg bg-white/10 border-l border-white/20 flex flex-col">
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">AI Reasoning</h3>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {reasoning ? (
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Current Thought Process:</div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {reasoning}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
              <span>Reasoning in real-time</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm">
            <Brain className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            No active reasoning process
          </div>
        )}
      </div>
    </div>
  );
};