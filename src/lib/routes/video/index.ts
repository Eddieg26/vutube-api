import { Router } from '../router';
import upload from './upload';

export const videoRouter = new Router('/videos');

videoRouter.post(upload.url, upload);
