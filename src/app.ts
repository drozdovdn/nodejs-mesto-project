import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { createUser, loginUser } from './controllers/auth';
import NotFoundError from './errors/no-found-error';
import auth from './middlewares/auth';
import { cardRouter, userRouter } from './routes';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// --- ERRORS ---
app.use(errors());
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError('Ничего не найдено');
  next(err);
});
app.use((err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(+PORT, () => {
  console.log(`Сервер запушен на порту  ${PORT}`);
});
