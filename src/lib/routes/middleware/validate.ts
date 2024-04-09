import {ZodType} from 'zod';
import {Context} from '../../services';
import {ServerError, StatusCode} from '../../types';
import {tryit} from 'radash';

export function validate<T, U>(
  schema: ZodType<T>,
  extractor: (ctx: Context) => T,
  callback: (value: T, ctx: Context) => Promise<U>
) {
  return async (ctx: Context) => {
    const value = extractor(ctx);
    const validated = schema.safeParse(value);
    if (validated.success) {
      const [error, data] = await tryit(callback)(validated.data, ctx);
      if (data) ctx.body = data;
      else if (error) {
        if (error instanceof ServerError) {
          ctx.status = error.status;
          ctx.body = {
            message: error.message,
            data: error.data,
          };
        } else {
          ctx.status = StatusCode.SERVER_ERROR;
          ctx.body = {
            message: error.message,
            data: {},
          };
        }
      }
    } else {
      const errors = parseErrors(validated.error.flatten().fieldErrors);
      ctx.status = StatusCode.VALIDATION;
      ctx.body = {
        message: 'Validation error',
        data: errors,
      };
    }
  };
}

type allKeys<T> = T extends any ? keyof T : never;

function parseErrors<T>(errors: {[P in allKeys<T>]?: string[] | undefined}) {
  const result: {[P in allKeys<T>]?: string | undefined} = {};
  for (const key in errors) {
    const value = errors[key as allKeys<T>];
    if (value) result[key as allKeys<T>] = value[0];
  }

  return result;
}
