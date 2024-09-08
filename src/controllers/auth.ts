import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }); //7d
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end(); // сохраняем в cookie на 7 дней
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { password, ...body } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      UserModel.create({
        password: hash,
        ...body,
      }),
    )
    .then((user) => {
      const { _id, email } = user;
      res.status(201).send({
        _id,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};
