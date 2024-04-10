import {object, string} from 'zod';
import {Context} from '../../services';
import {route, validate} from '../middleware';
import {StatusCode} from '../../types';
import {omit} from 'radash';
import {findUser, raise} from '../helpers';

async function signin(args: Signin, ctx: Context) {
  const {auth, database} = ctx.services;
  const {identifier, password} = args;

  const user = await findUser(database, identifier);
  if (!user) return raise(StatusCode.NOT_FOUND, 'User not found');

  const valid = await auth.comparePassword(password, user.password);
  if (!valid) return raise(StatusCode.UNAUTHORIZED, 'Invalid password');

  auth.setSessionCookie(ctx, auth.createSession(user.id));

  return omit(user, ['password']);
}

const schema = object({
  identifier: string().min(1),
  password: string().min(8),
});

type Signin = typeof schema._type;

export default route(
  '/signin',
  validate(schema, ctx => ctx.request.body as Signin, signin)
);
