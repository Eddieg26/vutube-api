import 'dotenv/config';
import bodyParser = require('koa-bodyparser');
import {App, Config, authRouter, userRouter} from './lib';

function main() {
  const app = new App(new Config());

  app.use(bodyParser());
  app.router(userRouter);
  app.router(authRouter);

  app.run().then(server => server.on('close', app.stop));
}

main();
