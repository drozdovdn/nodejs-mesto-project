import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

const { JWT_SECRET = 'dev-secret' } = process.env;

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      }); //7d
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end(); // сохраняем в cookie на 7 дней
    })
    .catch(next);
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
    .then(({ _id, about, avatar, name, email }) => {
      res.status(201).send({ _id, about, avatar, name, email });
    })
    .catch(next);
};
