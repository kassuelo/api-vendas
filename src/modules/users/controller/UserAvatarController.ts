import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarService = new UpdateUserAvatarService();

    const user = updateAvatarService.execute({
      userId: request.user.id,
      avatarFilename: request.file?.filename + '',
    });

    return response.json(instanceToInstance(user));
  }
}
