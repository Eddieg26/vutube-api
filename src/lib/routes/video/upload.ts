import {number, object, string} from 'zod';
import {Context} from '../../services';
import {User} from '../../models';
import {insertVideo, raise} from '../helpers';
import {StatusCode} from '../../types';
import {authenticate, getFile, route, validate} from '../middleware';

async function uploadVideo(upload: VideoUpload, ctx: Context) {
  const {title, description, thumbnailTime} = upload;
  const {videoStorage, database} = ctx.services;
  const user = ctx.state.user as User;

  const video = ctx.request.file;
  if (!video) return raise(StatusCode.VALIDATION, 'Video file is required');

  const {data: videoData, error} = await videoStorage.createVideo(
    title,
    user.id,
    thumbnailTime
  );

  if (error) return raise(error.status, error.message);

  console.log('Uploading video', video);
  const {success, message, statusCode} = await videoStorage.uploadVideo(
    videoData.videoId,
    video
  );

  if (!success) {
    //TODO: DELETE VIDEO
    return raise(statusCode as StatusCode, message);
  }

  const videoInput = {
    id: videoData.videoId,
    userId: user.id,
    title,
    description,
    url: videoStorage.getHLSUrl(videoData.videoId),
  };

  const result = await insertVideo(database, videoInput);

  if (!result) {
    //TODO: DELETE VIDEO
    return raise(StatusCode.SERVER_ERROR, 'Failed to create video');
  }

  return {success};
}

const schema = object({
  userId: string().uuid(),
  title: string().min(1).max(100),
  description: string().min(1).max(500),
  thumbnailTime: number().int().min(0).max(100).optional(),
});

type VideoUpload = typeof schema._type;

function extract(ctx: Context) {
  const body = ctx.request.body ?? {};
  return {
    ...(body as VideoUpload),
    userId: ctx.params.userId as string,
  };
}

export default route(
  '/upload/:userId',
  authenticate(getFile('video', validate(schema, extract, uploadVideo)))
);
