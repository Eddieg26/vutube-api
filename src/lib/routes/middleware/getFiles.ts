import multer = require('@koa/multer');
import {Context} from '../../services';

const upload = multer();

export function getFile<T>(field: string, route: (ctx: Context) => Promise<T>) {
  const middleware = upload.single(field);
  return async (ctx: Context) => {
    await middleware(ctx, async () => {});
    return await route(ctx);
  };
}

export function getFiles<T>(
  fields: multer.Field[],
  route: (ctx: Context) => Promise<T>
) {
  const middleware = upload.fields(fields);
  return async (ctx: Context) => {
    await middleware(ctx, async () => {});
    return await route(ctx);
  };
}
