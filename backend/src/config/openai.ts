import OpenAI from 'openai';
import axios from 'axios';
import { logger } from '../utils/logger';

// OpenAI Configuration (Primary)
const openaiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

let openaiClient: OpenAI | null = null;

if (openaiKey) {
  openaiClient = new OpenAI({
    apiKey: openaiKey,
  });
  logger.info('✅ OpenAI initialized');
} else {
  logger.warn('⚠️ OpenAI API key not found');
}

// OpenRouter Configuration (Fallback - Free tier)
const openRouterKey = process.env.OPENROUTER_API_KEY;
const openRouterModel = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';
const useOpenRouterFallback = process.env.USE_OPENROUTER_FALLBACK === 'true';

// Console log environment variables for debugging
console.log('🔍 OpenAI/OpenRouter Configuration:');
console.log('OPENAI_API_KEY:', openaiKey ? '✅ Set' : '❌ Not set');
console.log('OPENROUTER_API_KEY:', openRouterKey ? `✅ Set (${openRouterKey.substring(0, 20)}...)` : '❌ Not set');
console.log('OPENROUTER_MODEL:', openRouterModel);
console.log('USE_OPENROUTER_FALLBACK:', useOpenRouterFallback);

if (openRouterKey) {
  logger.info('✅ OpenRouter initialized as fallback');
} else {
  logger.warn('⚠️ OpenRouter API key not found');
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionParams {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate chat completion with OpenAI (primary) or OpenRouter (fallback)
 */
export const generateChatCompletion = async ({
  messages,
  temperature = 0.7,
  maxTokens = 1000,
}: ChatCompletionParams): Promise<string> => {
  // Try OpenAI first
  if (openaiClient) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      logger.info('✅ OpenAI chat completion successful');
      return content;
    } catch (error: any) {
      logger.error('❌ OpenAI error:', error.message);

      // Fall back to OpenRouter if enabled
      if (useOpenRouterFallback && openRouterKey) {
        logger.info('🔄 Falling back to OpenRouter...');
        return await generateOpenRouterCompletion({ messages, temperature, maxTokens });
      }

      throw error;
    }
  }

  // Use OpenRouter if OpenAI is not available
  if (openRouterKey) {
    return await generateOpenRouterCompletion({ messages, temperature, maxTokens });
  }

  throw new Error('No AI service available. Please configure OpenAI or OpenRouter API keys.');
};

/**
 * Generate chat completion with OpenRouter (supports many free models)
 */
const generateOpenRouterCompletion = async ({
  messages,
  temperature = 0.7,
  maxTokens = 1000,
}: ChatCompletionParams): Promise<string> => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: openRouterModel,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': process.env.API_URL || 'http://localhost:5000',
          'X-Title': 'Tangerine Furniture Assistant',
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenRouter response');
    }

    logger.info('✅ OpenRouter chat completion successful');
    return content;
  } catch (error: any) {
    logger.error('❌ OpenRouter error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Generate embeddings for vector search
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Embeddings require OpenAI API key.');
  }

  try {
    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error: any) {
    logger.error('❌ Embedding generation error:', error.message);
    throw error;
  }
};

/**
 * Analyze sentiment of text (for review analysis)
 */
export const analyzeSentiment = async (text: string): Promise<'positive' | 'neutral' | 'negative'> => {
  try {
    const response = await generateChatCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with only one word: positive, neutral, or negative.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      maxTokens: 10,
    });

    const sentiment = response.trim().toLowerCase();
    if (['positive', 'neutral', 'negative'].includes(sentiment)) {
      return sentiment as 'positive' | 'neutral' | 'negative';
    }

    return 'neutral';
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    return 'neutral';
  }
};

export { openaiClient, openRouterKey, openRouterModel };

