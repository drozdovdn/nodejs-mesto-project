import { Schema, model } from 'mongoose';

import { urlPattern } from './helpers';
import { IUser } from './user';

export interface ICard {
  name: string;
  link: string;
  owner: IUser;
  likes: IUser[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlPattern.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<ICard>('card', cardSchema);
