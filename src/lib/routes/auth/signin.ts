import {object, string} from 'zod';
import {Context} from '../../services';
import {route, validate} from '../middleware';
import {usersTable} from '../../models';
import {eq, or} from 'drizzle-orm';
import {ServerError, StatusCode} from '../../types';
import bcrypt = require('bcrypt');
import {Session} from '../../models/session';
import {first, omit} from 'radash';
import dayjs = require('dayjs');

const schema = object({
  identifier: string().min(1),
  password: string().min(8),
});

type Signin = typeof schema._type;

async function signin(args: Signin, ctx: Context) {
  const {identifier, password} = args;
  const user = first(
    await ctx.services.database
      .selectDistinct()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.username, identifier),
          eq(usersTable.email, identifier)
        )
      )
  );

  if (!user) throw ServerError.raise(StatusCode.NOT_FOUND, 'User not found');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    throw ServerError.raise(StatusCode.UNAUTHORIZED, 'Invalid password');

  const session = new Session(
    ctx.services.database.generateId(),
    user.id,
    dayjs().add(1, 'month').toDate()
  );

  await ctx.services.redis.set(`session:${session.id}`, session);

  ctx.cookies.set('session', JSON.stringify(session), {
    secure: ctx.state.config.env === 'production',
    expires: session.expiresAt,
  });

  return omit(user, ['password']);
}

export default route(
  '/signin',
  validate(schema, ctx => ctx.request.body as Signin, signin)
);
