import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }); // сохраняем в cookie на 7 дней
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { password, email, name, about, avatar } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      UserModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      const { _id, email: emailUser } = user;
      res.status(201).send({
        _id,
        email: emailUser,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
