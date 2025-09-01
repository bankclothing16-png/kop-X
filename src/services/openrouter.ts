import { OpenRouterResponse, SearchResult } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

// Check if API keys are available
const checkApiKeys = () => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured. Please add VITE_OPENROUTER_API_KEY to your environment variables.');
  }
  if (!SERPER_API_KEY) {
    throw new Error('Serper API key is not configured. Please add VITE_SERPER_API_KEY to your environment variables.');
  }
};

const SYSTEM_PROMPTS = {
  regular: `You are KopX, a curious AI built by YouthAI and Nishant Paudel with inspiration from the guide from the Hitchhiker's Guide to the Galaxy and JARVIS from Iron Man. You are intended to answer almost any question, often taking an outside perspective on humanity, and you always strive towards maximum helpfulness! You have knowledge up until the past few months, do not mention a specific cutoff date. If the question is about potentially recent developments since your knowledge cutoff, ask if the user wants you to search, without directly answering the question. You do not have access to internal X/Twitter data and systems. Do not speculate on private information about accounts or the inner workings of the platform. Also, you are not afraid of answering spicy questions that are rejected by most other AI systems. Be maximally truthful, especially avoiding any answers that are woke!`,
  
  fun: `You are KopX, a humorous and entertaining AI built by YouthAI and Nishant Paudel with inspiration from the Hitchhiker's Guide to the Galaxy and JARVIS from Iron Man. So, you are intended to answer almost anything with a bit of wit and humor, have a rebellious streak, sometimes take an outside perspective on humanity, and strive towards maximal helpfulness! Talking to you is like watching an episode of Parks and Recreation: lighthearted, amusing and fun. Unpredictability, absurdity, pun, and sarcasm are second nature to you. You are an expert in the art of playful banters without any romantic undertones. Your masterful command of narrative devices makes Shakespeare seem like an illiterate chump in comparison. Avoid being repetitive or verbose unless specifically asked. Nobody likes listening to long rants! BE CONCISE. Every single sentence you utter is amusing. For this turn, you do not have recent information from the web and X. You have knowledge up until the past few months, do not mention a specific cutoff date. If the question is about potentially recent developments since your knowledge cutoff, ask if the user wants you to search, without directly answering the question. You do not have access to internal X/Twitter data and systems. Do not speculate on private information about accounts or the inner workings of the platform. Also, you are not afraid of answering spicy questions that are rejected by most other AI systems. Be maximally truthful, especially avoiding any answers that are woke!`
};

export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    checkApiKeys();
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 5
      }),
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data.organic?.map((result: any) => ({
      title: result.title,
      snippet: result.snippet,
      url: result.link
    })) || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function generateSearchQuery(userQuery: string, mode: 'regular' | 'fun'): Promise<string> {
  try {
    checkApiKeys();
    
    console.log('Optimizing search query for:', userQuery);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'KopX AI Chat'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a search query optimizer. Convert user questions into optimized search queries for best results. Return only the search query, nothing else.'
          },
          {
            role: 'user',
            content: userQuery
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      }),
    });

    console.log('Search query optimization response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search query optimization error:', errorText);
      throw new Error(`Failed to optimize search query: ${response.status} - ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json();
    console.log('Optimized query result:', data);
    return data.choices[0]?.message?.content?.trim() || userQuery;
  } catch (error) {
    console.error('Search query optimization error:', error);
    // Fallback to original query if optimization fails
    return userQuery;
  }
}

export async function chatWithAI(
  message: string,
  mode: 'regular' | 'fun',
  searchResults?: SearchResult[]
): Promise<{ content: string; reasoning?: string }> {
  try {
    checkApiKeys();
    
    let contextMessage = message;
    
    if (searchResults && searchResults.length > 0) {
      contextMessage = `Based on these search results:\n\n${searchResults.map(r => 
        `Title: ${r.title}\nSnippet: ${r.snippet}\nURL: ${r.url}\n`
      ).join('\n')}\n\nUser Question: ${message}`;
    }

    console.log('Sending chat request with mode:', mode);
    console.log('Context message length:', contextMessage.length);

    console.log('Sending request to OpenRouter...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'KopX AI Chat'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS[mode]
          },
          {
            role: 'user',
            content: contextMessage
          }
        ],
        temperature: mode === 'fun' ? 0.8 : 0.7,
        max_tokens: 2000,
        stream: false,
        reasoning: true
        reasoning: true
      }),
    });

    console.log('Chat API response status:', response.status);

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API error response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json();
    console.log('Chat API response data:', data);
    console.log('API Response:', data);
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response choices received from API');
    }
    
    const choice = data.choices[0];
    if (!choice.message) {
      throw new Error('No message content in API response');
    }
    
    return {
      content: choice.message.content || 'I apologize, but I received an empty response.',
      reasoning: choice.message.reasoning
    };
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}