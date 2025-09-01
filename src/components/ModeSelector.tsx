import React from 'react';
import { Brain, Sparkles, Settings } from 'lucide-react';
import { ChatConfig } from '../types';

interface Props {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

export const ModeSelector: React.FC<Props> = ({ config, onConfigChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
        <button
          onClick={() => onConfigChange({ ...config, mode: 'regular' })}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            config.mode === 'regular'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Brain className="w-4 h-4" />
          Regular
        </button>
        <button
          onClick={() => onConfigChange({ ...config, mode: 'fun' })}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            config.mode === 'fun'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Fun
        </button>
      </div>
      
      <button
        onClick={() => onConfigChange({ ...config, showReasoning: !config.showReasoning })}
        className={`p-2 rounded-xl transition-all ${
          config.showReasoning
            ? 'bg-cyan-500 text-white shadow-lg'
            : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
        }`}
        title="Toggle reasoning panel"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};