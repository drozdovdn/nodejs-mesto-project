import { Joi, celebrate, errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { createUser, loginUser } from './controllers/auth';
import auth from './middlewares/auth';
import { errorsNotFound, errorsServer } from './middlewares/errors';
import { errorLogger, requestLogger } from './middlewares/logger';
import { cardRouter, userRouter } from './routes';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

// --- ERRORS ---
app.use(errors());
app.use(errorsNotFound);
app.use(errorsServer);

app.listen(+PORT, () => {
  console.log(`Сервер запушен на порту  ${PORT}`);
});
