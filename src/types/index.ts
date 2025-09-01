export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  timestamp: Date;
  isSearchResult?: boolean;
}

export interface ChatConfig {
  mode: 'regular' | 'fun';
  showReasoning: boolean;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      reasoning?: string;
    };
  }>;
}