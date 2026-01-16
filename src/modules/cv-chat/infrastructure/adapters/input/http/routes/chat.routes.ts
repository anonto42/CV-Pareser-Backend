import { Router } from 'express';
import { ChatController } from '../controllers/Chat.controller';

export function createChatRoutes(chatController: ChatController): Router {
  const router = Router();

  router.route('/chat').post(chatController.chat);

  return router;
}
