import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';

import { getCurrentUser, getUserId, getUsers, updateUser, updateUserAvatar } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({ userId: Joi.string().required().length(24) }),
  }),
  getUserId,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  updateUser,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateUserAvatar,
);

export default userRouter;
