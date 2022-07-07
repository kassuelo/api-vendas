import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const storageProvider = new DiskStorageProvider();

    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }
    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const filename = await storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
