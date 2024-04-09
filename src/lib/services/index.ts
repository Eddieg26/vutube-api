import Koa = require('koa');
import {Session, User} from '../models';
import {Config} from '../types';
import {Database} from './database';
import {Redis} from './redis';

export {Database, Redis};

export type AppContext = {
  services: Services;
};

export type AppState = {
  user?: User;
  session?: Session;
  config: Config;
};

export type Context = Koa.ParameterizedContext<AppState, AppContext>;

export class Services {
  database: Database;
  redis: Redis;

  constructor(config: Config) {
    this.database = new Database(config.dbUrl);
    this.redis = new Redis();
  }
}
