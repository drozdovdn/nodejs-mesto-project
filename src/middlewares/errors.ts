import { NextFunction, Request, Response } from 'express';

import NotFoundError from '../errors/no-found-error';

export const errorsServer = (
  err: Error & { statusCode: number; code: number } & any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = 500, message } = err;

  if (err.code === 11000) {
    //если пользователь которого хотим создать уже существует
    res.status(409).send({ message: 'Данный пользователь уже существует' });
  }

  // if (err.code === 11000) {
  //   //если пользователь хочет удалить чужую карточку
  //   return res.status(403).send({ message: 'Не достаточно прав' });
  // }

  if (err.message.includes('Validation failed')) {
    res.status(400).send({ message: err.message.replace('Validation failed: ', '') });
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export const errorsNotFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError('Ничего не найдено');
  next(err);
};
