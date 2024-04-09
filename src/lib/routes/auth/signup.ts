import {object, string} from 'zod';
import {Context} from '../../services';
import {usersTable} from '../../models';
import {omit} from 'radash';
import {ServerError, StatusCode} from '../../types';
import {route, validate} from '../middleware';
import {eq} from 'drizzle-orm';
import bcrypt = require('bcrypt');

const schema = object({
  email: string().email(),
  password: string().min(8),
  username: string().min(1).max(64),
});

type Signup = typeof schema._type;

async function signup(args: Signup, ctx: Context) {
  const {database} = ctx.services;
  const {email, username} = args;

  const foundEmail = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (foundEmail.length > 0)
    throw new ServerError(
      StatusCode.CONFLICT,
      'User with email already exists',
      {email}
    );

  const foundUsername = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (foundUsername.length > 0)
    throw ServerError.raise(StatusCode.CONFLICT, 'Username already exists', {
      email,
    });

  const id = database.generateId();
  const password = await bcrypt.hash(args.password, 10);

  const user = await database
    .insert(usersTable)
    .values({id, email, username, password})
    .returning();

  if (user.length === 0)
    throw ServerError.raise(StatusCode.SERVER_ERROR, 'Failed to create user');

  return omit(user[0], ['password']);
}

export default route(
  '/signup',
  validate(schema, ctx => ctx.request.body as Signup, signup)
);
