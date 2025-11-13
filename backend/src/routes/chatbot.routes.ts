import { Router } from 'express';
import * as chatbotController from '../controllers/chatbot.controller';

const router = Router();

/**
 * POST /api/v1/chatbot/message
 * Send a message to the AI chatbot
 * Public route - no authentication required
 */
router.post('/message', chatbotController.sendMessage);

/**
 * POST /api/v1/chatbot/feedback
 * Submit feedback for a chatbot response
 * Public route
 */
router.post('/feedback', chatbotController.submitFeedback);

/**
 * GET /api/v1/chatbot/history
 * Get chat history (future feature)
 */
router.get('/history', chatbotController.getChatHistory);

export default router;
