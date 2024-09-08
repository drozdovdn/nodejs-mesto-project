import { NextFunction, Request, Response } from 'express';

import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/no-found-error';
import CardModel from '../models/card';
import { RequestPayload } from '../types';

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch(next);

export const createCard = (req: RequestPayload, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return CardModel.create({ name, link, owner: req?.user?._id })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

export const deleteCardId = async (req: RequestPayload, res: Response, next: NextFunction) => {
  CardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (String(card.owner) !== String(req?.user?._id)) {
        throw new ForbiddenError('Недостаточно прав');
      }

      //Удаляю карточку
      CardModel.deleteOne({ _id: card._id })
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        })
        .catch(next);
    })
    .catch(next);
};

export const likeCard = (req: RequestPayload, res: Response, next: NextFunction) =>
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch(next);

export const dislikeCard = (req: RequestPayload, res: Response, next: NextFunction) =>
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req?.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch(next);
