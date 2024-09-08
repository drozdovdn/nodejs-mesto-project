import { NextFunction, Request, Response } from 'express';

import NotFoundError from '../errors/no-found-error';
import UserModel from '../models/user';
import { RequestPayload } from '../types';

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  UserModel.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const getUserId = (req: Request, res: Response, next: NextFunction) =>
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const getCurrentUser = (req: RequestPayload, res: Response, next: NextFunction) =>
  UserModel.findById(req?.user?._id)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const updateUser = (req: RequestPayload, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return UserModel.findByIdAndUpdate(req?.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: RequestPayload, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return UserModel.findByIdAndUpdate(req?.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};
