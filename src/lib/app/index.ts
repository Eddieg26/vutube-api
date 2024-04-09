import Koa = require('koa');
import type {Config} from '../types';
import {AppContext, AppState, Services} from '../services';
import {Router} from '../routes';

export class App {
  config: Config;
  services: Services;
  private server: Koa<AppState, AppContext>;

  constructor(config: Config) {
    this.config = config.validate();
    this.services = new Services(config);
    this.server = new Koa<AppState, AppContext>();
    this.server.use(async (ctx, next) => {
      ctx.services = this.services;
      ctx.state.config = this.config;

      await next();
    });
  }

  use(middleware: Koa.Middleware<AppState, AppContext>): App {
    this.server.use(middleware);
    return this;
  }

  router(router: Router): App {
    this.server.use(router.routes());
    this.server.use(router.allowedMethods());
    return this;
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): App {
    this.server.on(eventName, listener);
    return this;
  }

  off(eventName: string | symbol, listener: (...args: any[]) => void): App {
    this.server.off(eventName, listener);
    return this;
  }

  once(eventName: string | symbol, listener: (...args: any[]) => void): App {
    this.server.once(eventName, listener);
    return this;
  }

  emit(eventName: string | symbol, ...args: any[]): boolean {
    return this.server.emit(eventName, ...args);
  }

  async run() {
    return this.services.redis.connect().then(() => {
      console.log('Starting server on port', this.config.port);
      return this.server.listen(this.config.port);
    });
  }

  async stop() {
    return this.services.redis.disconnect().then(() => {
      console.log('Stopping server');
    });
  }
}
