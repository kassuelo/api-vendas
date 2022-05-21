import { Request, Response } from 'express';
import ShowProfileService from '../services/ShowProfiileService';
import UpdateProfileService from '../services/UpdateProfiileService';

export default class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProfile = new ShowProfileService();
    const userId = request.user.id;
    const user = await showProfile.execute({ userId });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;
    const updateProfile = new UpdateProfileService();
    const userId = request.user.id;
    const user = await updateProfile.execute({
      userId,
      name,
      email,
      password,
      old_password,
    });
    return response.json(user);
  }
}
