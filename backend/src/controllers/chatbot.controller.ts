import { Request, Response } from 'express';
import chatbotService from '../services/ai/chatbot.service';
import { logger } from '../utils/logger';

/**
 * Send message to chatbot
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, sessionId, conversationHistory, pageContext, currentPage } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Message and sessionId are required',
            });
        }

        const response = await chatbotService.processMessage(message, {
            sessionId,
            conversationHistory: conversationHistory || [],
            pageContext: pageContext || 'Website',
            currentPage: currentPage || '/',
        });

        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error: any) {
        logger.error('Chatbot message error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message',
            message: error.message,
        });
    }
};

/**
 * Submit feedback for chatbot response
 */
export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { messageId, rating, feedback, sessionId } = req.body;

        if (!messageId || !sessionId) {
            return res.status(400).json({
                success: false,
                error: 'MessageId and sessionId are required',
            });
        }

        // TODO: Store feedback in database
        logger.info(`Chatbot feedback: ${messageId} - ${rating}`);

        res.status(200).json({
            success: true,
            message: 'Feedback received',
        });
    } catch (error: any) {
        logger.error('Chatbot feedback error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit feedback',
        });
    }
};

/**
 * Get chat history for authenticated user
 */
export const getChatHistory = async (req: Request, res: Response) => {
    try {
        // TODO: Implement chat history with session-based storage
        res.status(200).json({
            success: true,
            data: {
                history: [],
                message: 'Chat history feature coming soon',
            },
        });
    } catch (error: any) {
        logger.error('Chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch chat history',
        });
    }
};
