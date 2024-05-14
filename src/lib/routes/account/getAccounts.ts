import { eq } from 'drizzle-orm';
import { string } from 'zod';
import { accountsTable } from '../../models';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function getAccounts(id: string, ctx: Context) {
  if (ctx.state.user?.id !== id)
    return raise(StatusCode.FORBIDDEN, 'Forbidden', {id});

  const accounts = await ctx.services.database
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.user_id, id));

  return {accounts};
}

const schema = string({
  invalid_type_error: 'Id must be a uuid',
  required_error: 'Id is required',
}).uuid();

export default route(
  '/user/:id',
  authenticate(validate(schema, ctx => ctx.query.id as string, getAccounts))
);
