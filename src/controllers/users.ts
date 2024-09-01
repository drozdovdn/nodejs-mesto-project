import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user';
import NotFoundError from '../errors/no-found-error';

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

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return UserModel.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return UserModel.findByIdAndUpdate(req?.user?._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return UserModel.findByIdAndUpdate(req?.user?._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};
