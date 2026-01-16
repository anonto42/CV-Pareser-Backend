import { ChatUseCaseImpl } from "../../application/usecases/Chat.usecase";
import { GoogleGeminiAdapter } from "../adapters/output/ai/GoogleGemini.adapter";
import { ChatController } from "../adapters/input/http/controllers/Chat.controller";
import { createChatRoutes } from "../adapters/input/http/routes/chat.routes";
import { VectorDBAdapter } from "../../../../shared/infrastructure/adapter/output/vector-db/VectorDB.adapter";
import { ProcessedCVRepositoryAdapter } from "../../../../shared/infrastructure/adapter/output/persistence/ProcessedCVRepository.adapter";

export class ChatContainer {
  private static instance: ChatContainer;

  private chatUseCase: ChatUseCaseImpl;
  private aiModel: GoogleGeminiAdapter;
  private chatController: ChatController;

  private constructor() {
    this.aiModel = new GoogleGeminiAdapter();
    const vectorDb = new VectorDBAdapter();
    const cvRepository = new ProcessedCVRepositoryAdapter();

    this.chatUseCase = new ChatUseCaseImpl(this.aiModel, vectorDb, cvRepository);
    this.chatController = new ChatController(this.chatUseCase);
  }

  static getInstance(): ChatContainer {
    if (!ChatContainer.instance) {
      ChatContainer.instance = new ChatContainer();
    }
    return ChatContainer.instance;
  }

  getChatController(): ChatController {
    return this.chatController;
  }

  getChatRoutes() {
    return createChatRoutes(this.chatController);
  }
}
