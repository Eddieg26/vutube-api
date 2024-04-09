import {string} from 'zod';
import {Context} from '../../services';
import {authenticate, route, validate} from '../middleware';
import {usersTable} from '../../models';
import {eq} from 'drizzle-orm';
import {ServerError, StatusCode} from '../../types';
import {first, omit} from 'radash';

const schema = string({
  invalid_type_error: 'Id must be a string',
  required_error: 'Id is required',
}).length(24);

async function getUser(id: string, ctx: Context) {
  const user = first(
    await ctx.services.database
      .selectDistinct()
      .from(usersTable)
      .where(eq(usersTable.id, id))
  );

  if (!user)
    throw new ServerError(StatusCode.NOT_FOUND, 'User not found', {id});

  if (ctx.state.user?.id !== user.id)
    throw new ServerError(StatusCode.FORBIDDEN, 'Forbidden', {id});

  return omit(user, ['password']);
}

export default route(
  '/:id',
  authenticate(validate(schema, ctx => ctx.query.id as string, getUser))
);
