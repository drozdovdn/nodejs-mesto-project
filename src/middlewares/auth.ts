import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UnauthorizedError from '../errors/unauthorized-error';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const { JWT_SECRET = 'dev-secret' } = process.env;

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  if (!req?.cookies?.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
