import {ServerError, StatusCode} from '../../types';

export function raise(
  status: StatusCode,
  message: string,
  meta?: Record<string, unknown>
): never {
  throw new ServerError(status, message, meta);
}
