import {Router} from '../router';
import signin from './signin';
import signout from './signout';
import signup from './signup';

export const authRouter = new Router('/auth');

authRouter.post(signup.url, signup);
authRouter.post(signin.url, signin);
authRouter.delete(signout.url, signout);
