import { eq } from 'drizzle-orm';
import { omit } from 'radash';
import { object, string } from 'zod';
import { accountsTable } from '../../models';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function updateAccount(args: AccountUpdate, ctx: Context) {
  if (ctx.state.user?.id !== args.user_id)
    return raise(StatusCode.FORBIDDEN, 'Forbidden', {id: args.user_id});

  const existing = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.username, args.username));

  if (existing.length > 0)
    return raise(StatusCode.CONFLICT, 'Username already exists');

  const accounts = await ctx.services.database
    .update(accountsTable)
    .set(omit(args, ['user_id']))
    .where(eq(accountsTable.user_id, args.user_id))
    .returning();

  return accounts[0];
}

const schema = object({
  user_id: string().uuid(),
  username: string().min(1).max(100),
});

type AccountUpdate = typeof schema._type;

export default route(
  '/:id',
  authenticate(
    validate(
      schema,
      ctx => ({
        user_id: ctx.query.id as string,
        username: (ctx.request.body as any).username,
      }),
      updateAccount
    )
  )
);
