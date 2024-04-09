import {Context} from '../../services';
import {ServerError, StatusCode} from '../../types';

export function tryRoute<T>(route: (ctx: Context) => Promise<T>) {
  return async (ctx: Context) => {
    try {
      ctx.status = StatusCode.OK;
      ctx.body = await route(ctx);
    } catch (e) {
      if (e instanceof ServerError) {
        ctx.status = e.status;
        ctx.body = {
          message: e.message,
          data: e.meta,
        };
      } else if (e instanceof Error) {
        ctx.status = StatusCode.SERVER_ERROR;
        ctx.body = {
          message: e.message,
          data: {},
        };
      } else {
        ctx.status = StatusCode.SERVER_ERROR;
        ctx.body = {
          message: 'Unknown error',
          data: {},
        };
      }
    }
  };
}
