import { Router } from '../router';
import getUser from './getUser';

export const userRouter = new Router('/users');

userRouter.get(getUser.url, getUser);
