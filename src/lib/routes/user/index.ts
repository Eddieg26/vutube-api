import {Router} from '../router';
import getUser from './getUser';

export const userRouter = new Router('/user');

userRouter.get(getUser.url, getUser);
