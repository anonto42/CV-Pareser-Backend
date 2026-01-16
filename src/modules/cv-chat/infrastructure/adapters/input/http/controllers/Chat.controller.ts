import { Request, Response, NextFunction } from 'express';
import { ChatUseCase } from '../../../../../application/ports/input/ChatUseCase.port';
import { chatRequestSchema } from '../validator/chat.validator';
import sendResponse from '../../../../../../../shared/infrastructure/helpers/sendResponse.helper';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../../../shared/infrastructure/helpers/catchAsync.helper';

export class ChatController {
  constructor(private readonly chatUseCase: ChatUseCase) {}

  chat = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validatedData = chatRequestSchema.parse(req.body);
    
    const result = await this.chatUseCase.execute(validatedData.prompt as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Chat generated successfully',
      data: result
    });
  });
}
