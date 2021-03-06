import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { compare } from 'bcryptjs';
import User from '../typeorm/entities/User';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect e-mail.', 401);
    }
    const authenticatedUser = await compare(password, user.password);
    if (!authenticatedUser) {
      throw new AppError('Incorrect password.', 401);
    }
    const token = jwt.sign({}, process.env.APP_SECRET + '', {
      subject: user.id,
      expiresIn: '1d',
      algorithm: 'HS256',
    });
    const response = { user, token };
    return response;
  }
}

export default CreateSessionService;
