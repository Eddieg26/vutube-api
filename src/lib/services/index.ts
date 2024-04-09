import Koa = require('koa');
import {Session, User} from '../models';
import {Config} from '../types';
import {Database} from './database';
import {Redis} from './redis';
import {VideoStorage} from './storage';

export {Database, Redis};

export type AppContext = {
  services: Services;
} & Koa.DefaultContext;

export type AppState = {
  user?: User;
  session?: Session;
  config: Config;
} & Koa.DefaultState;

export type Context = Koa.ParameterizedContext<AppState, AppContext>;

export class Services {
  database: Database;
  redis: Redis;
  videoStorage: VideoStorage;

  constructor(config: Config) {
    this.database = new Database(config.dbUrl);
    this.redis = new Redis();
    this.videoStorage = new VideoStorage();
  }
}
