import 'dotenv/config';
import bodyParser = require('koa-bodyparser');
import {App, Config, authRouter, userRouter} from './lib';

async function main() {
  const app = new App(new Config());

  app.use(bodyParser());
  app.router(userRouter);
  app.router(authRouter);

  const server = await app.run();
  server.on('close', app.stop.bind(app));
}

main();
