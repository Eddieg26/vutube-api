import {getFile} from '../middleware';
import {Router} from '../router';
import getUser from './getUser';

export const userRouter = new Router('/user');

userRouter.get(getUser.url, getUser);

userRouter.post(
  '/upload',
  getFile('file', async ctx => {
    const file = ctx.request.file;
    if (file) {
      ctx.body = {
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          name: file.filename ?? file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      };
    } else {
      ctx.throw(400, 'No file uploaded');
    }
  })
);
