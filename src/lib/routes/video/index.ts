import {Router} from '../router';
import upload from './upload';

export const videoRouter = new Router('/video');

videoRouter.post(upload.url, upload);
