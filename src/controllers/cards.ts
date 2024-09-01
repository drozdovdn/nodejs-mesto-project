import { NextFunction, Request, Response } from 'express';
import CardModel from '../models/card';
import NotFoundError from '../errors/no-found-error';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const createCard = (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return CardModel.create({ name, link, owner: req?.user?._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const deleteCardId = (req: Request, res: Response, next: NextFunction) =>
  CardModel.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const likeCard = (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) =>
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });

export const dislikeCard = (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) =>
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req?.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
