import 'dotenv/config';
import {App, Config, authRouter, bodyParser, userRouter} from './lib';

async function main() {
  const app = new App(new Config());

  app.use(bodyParser());
  app.router(authRouter);
  app.router(userRouter);

  const server = await app.run();
  server.on('close', app.stop.bind(app));
}

main();
