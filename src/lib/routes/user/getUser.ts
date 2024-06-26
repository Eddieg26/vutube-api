import { omit } from 'radash';
import { string } from 'zod';
import { Context } from '../../services';
import { StatusCode } from '../../types';
import { findUserById, raise } from '../helpers';
import { authenticate, route, validate } from '../middleware';

async function getUser(id: string, ctx: Context) {
  if (ctx.state.user?.id !== id)
    return raise(StatusCode.FORBIDDEN, 'Forbidden', {id});

  const user = await findUserById(ctx.services.database, id);
  if (!user) return raise(StatusCode.NOT_FOUND, 'User not found', {id});

  return omit(user, ['password']);
}

const schema = string({
  invalid_type_error: 'Id must be a uuid',
  required_error: 'Id is required',
}).uuid();

export default route(
  '/:id',
  authenticate(validate(schema, ctx => ctx.query.id as string, getUser))
);
