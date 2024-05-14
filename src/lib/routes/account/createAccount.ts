import { eq } from 'drizzle-orm';
import { object, string } from 'zod';
import { accountsTable } from '../../models';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function createAccount(args: AccountCreate, ctx: Context) {
  if (ctx.state.user?.id !== args.user_id)
    raise(StatusCode.FORBIDDEN, 'Forbidden', {id: args.user_id});

  const existing = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.username, args.username));

  if (existing.length > 0)
    raise(StatusCode.CONFLICT, 'Username already exists');

  let accounts = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.user_id, args.user_id));

  if (accounts.length >= 3)
    raise(
      StatusCode.CONFLICT,
      'User has reached the account limit of 3 accounts'
    );

  accounts = await ctx.services.database
    .insert(accountsTable)
    .values(args)
    .returning();

  return accounts[0];
}

const schema = object({
  user_id: string().uuid(),
  username: string().min(1).max(100),
});

type AccountCreate = typeof schema._type;

export default route(
  '/:id',
  authenticate(
    validate(
      schema,
      ctx => ({
        user_id: ctx.query.id as string,
        username: (ctx.request.body as any).username,
      }),
      createAccount
    )
  )
);
