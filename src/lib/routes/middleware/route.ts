import {Context} from '../../services';

type Route = {
  (ctx: Context): Promise<void>;
  url: string;
};

export function route(
  url: string,
  callback: (ctx: Context) => Promise<void>
): Route {
  const func = callback as Route

  func.url = url;

  return func;
}
