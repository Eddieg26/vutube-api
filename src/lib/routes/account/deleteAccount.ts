import { eq } from 'drizzle-orm';
import { string } from 'zod';
import { accountsTable } from '../../models';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function deleteAccount(id: string, ctx: Context) {
  const account = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.id, id));

  if (!account.length)
    return raise(StatusCode.NOT_FOUND, 'Account not found', {id});

  if (ctx.state.user?.id !== account[0].user_id)
    return raise(StatusCode.FORBIDDEN, 'Forbidden', {id});

  await ctx.services.database
    .delete(accountsTable)
    .where(eq(accountsTable.id, id));

  return {id};
}

const schema = string().uuid();

export default route(
  '/:id',
  authenticate(validate(schema, ctx => ctx.params.id as string, deleteAccount))
);
