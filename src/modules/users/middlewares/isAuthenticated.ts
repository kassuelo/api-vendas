import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface ITokenPayload {
  sub: string; //(subject) = Entidade à quem o token pertence, normalmente o ID do usuário;
  iat: number; //(issued at) = Timestamp de quando o token foi criado;
  exp: number; //(expiration) = Timestamp de quando o token irá expirar;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token is missing', 401);
  }
  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET + '');
    const { sub } = decodedToken as ITokenPayload;
    request.user = { id: sub };

    console.log(decodedToken);
    return next();
  } catch (e) {
    console.log('Error:' + e);
    throw new AppError('Invalid token.');
  }
}
