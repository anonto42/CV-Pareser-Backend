import { IChatReturn } from "../../dto/ChatReturn.dto";

export interface ChatUseCase {
  execute(prompt: string): Promise<IChatReturn>;
}
