import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import bcrypt from 'bcrypt';
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
    const authenticatedUser = await bcrypt.compare(password, user.password);
    if (!authenticatedUser) {
      throw new AppError('Incorrect password.', 401);
    }
    console.log('env:' + process.env.SECRET);
    const token = jwt.sign({ id: user.id }, process.env.SECRET + '', {
      subject: user.id,
      expiresIn: '1d',
      algorithm: 'HS256',
    });
    const response = { user, token };
    return response;
  }
}

export default CreateSessionService;
