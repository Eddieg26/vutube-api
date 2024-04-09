import Koa = require('koa');
import KoaRouter = require('@koa/router');
import {AppContext, AppState} from '../services';

export class Router {
  private router: KoaRouter<AppState, AppContext>;

  constructor(basePath: string) {
    this.router = new KoaRouter<AppState, AppContext>({prefix: basePath});
  }

  get(
    path: string,
    ...handlers: Koa.Middleware<AppState, AppContext>[]
  ): Router {
    this.router.get(path, ...handlers);
    return this;
  }

  post(
    path: string,
    ...handlers: Koa.Middleware<AppState, AppContext>[]
  ): Router {
    this.router.post(path, ...handlers);
    return this;
  }

  put(
    path: string,
    ...handlers: Koa.Middleware<AppState, AppContext>[]
  ): Router {
    this.router.put(path, ...handlers);
    return this;
  }

  delete(
    path: string,
    ...handlers: Koa.Middleware<AppState, AppContext>[]
  ): Router {
    this.router.delete(path, ...handlers);
    return this;
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
