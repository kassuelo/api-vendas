import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';
import { pagination } from 'typeorm-pagination';
//import rateLimiter from '@shared/middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

//app.use(rateLimiter);

app.use(pagination);

app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  },
);
const port = Number.parseInt(
  '' + process.env.APP_API_URL?.substring(process.env.APP_API_URL.length - 4),
);
app.get('/', (req, res) => res.send('Bem vindo!'));
app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port}!`);
});
