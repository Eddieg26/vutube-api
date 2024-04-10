import {string} from 'zod';
import {Context} from '../../services';
import {authenticate, route, validate} from '../middleware';
import {StatusCode} from '../../types';
import {omit} from 'radash';
import {findUserById, raise} from '../helpers';

async function getUser(id: string, ctx: Context) {
  const user = await findUserById(ctx.services.database, id);
  if (!user) return raise(StatusCode.NOT_FOUND, 'User not found', {id});

  if (ctx.state.user?.id !== user.id)
    return raise(StatusCode.FORBIDDEN, 'Forbidden', {id});

  return omit(user, ['password']);
}

const schema = string({
  invalid_type_error: 'Id must be a string',
  required_error: 'Id is required',
}).length(24);

export default route(
  '/:id',
  authenticate(validate(schema, ctx => ctx.query.id as string, getUser))
);
