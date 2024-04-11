import {object, string} from 'zod';
import {Context} from '../../services';
import {omit} from 'radash';
import {StatusCode} from '../../types';
import {route, validate} from '../middleware';
import {
  insertUser,
  findUserByEmail,
  findUserByUsername,
  raise,
} from '../helpers';

async function signup(args: Signup, ctx: Context) {
  const {auth, database} = ctx.services;
  const {email, username} = args;

  const foundEmail = await findUserByEmail(database, email);
  if (foundEmail)
    return raise(StatusCode.CONFLICT, 'User with email already exists');

  const foundUsername = await findUserByUsername(database, username);
  if (foundUsername)
    return raise(StatusCode.CONFLICT, 'Username already exists');

  const id = database.generateId();
  const password = await auth.hashPassword(args.password);

  const user = await insertUser(database, {id, email, username, password});
  if (!user) return raise(StatusCode.SERVER_ERROR, 'Failed to create user');

  return omit(user, ['password']);
}

const schema = object({
  email: string().email(),
  password: string().min(8),
  username: string().min(1).max(64),
});

type Signup = typeof schema._type;

export default route(
  '/signup',
  validate(schema, ctx => ctx.request.body as Signup, signup)
);
