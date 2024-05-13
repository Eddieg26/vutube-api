import { omit } from 'radash';
import { object, string } from 'zod';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { findUserByEmail, insertUser, raise } from '../helpers';
import { route, validate } from '../middleware';

async function signup(args: Signup, ctx: Context) {
  const {auth, database} = ctx.services;
  const {email} = args;

  const foundEmail = await findUserByEmail(database, email);
  if (foundEmail)
    return raise(StatusCode.CONFLICT, 'User with email already exists');

  const id = database.generateId();
  const password = await auth.hashPassword(args.password);

  const user = await insertUser(database, {id, email, password});
  if (!user) return raise(StatusCode.SERVER_ERROR, 'Failed to create user');

  return omit(user, ['password']);
}

const schema = object({
  email: string().email(),
  password: string().min(8),
});

type Signup = typeof schema._type;

export default route(
  '/signup',
  validate(schema, ctx => ctx.request.body as Signup, signup)
);
