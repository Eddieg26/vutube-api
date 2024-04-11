import {Context} from '../../services';

export function notFound(ctx: Context) {
  ctx.throw(404, 'Route Not Found');
}
