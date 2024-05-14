import { eq } from 'drizzle-orm';
import { string } from 'zod';
import { accountsTable } from '../../models';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function getAccount(id: string, ctx: Context) {
  const account = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.id, id));

  if (!account.length) raise(StatusCode.NOT_FOUND, 'Account not found', {id});

  if (ctx.state.user?.id !== account[0].user_id)
    raise(StatusCode.FORBIDDEN, 'Forbidden', {id});

  return account[0];
}

const schema = string().uuid();

export default route(
  '/id/:id',
  authenticate(validate(schema, ctx => ctx.query.id as string, getAccount))
);
