import 'dotenv/config';
import {
  App,
  Config,
  authRouter,
  bodyParser,
  notFound,
  userRouter,
  videoRouter,
} from './lib';

async function main() {
  const app = new App(new Config());

  app.use(bodyParser());
  app.router(authRouter);
  app.router(userRouter);
  app.router(videoRouter);
  app.use(notFound);

  const server = await app.run();
  server.on('close', app.stop.bind(app));
}

main();
