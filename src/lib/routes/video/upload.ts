import {number, object, string} from 'zod';
import { Context } from '../../services';

const schema = object({
  title: string().min(1).max(100),
  description: string().min(1).max(500),
  thumbnailTime: number().int().min(0).max(100).optional(),
});

type VideoUpload = typeof schema._type;

export async function uploadVideo(upload: VideoUpload, ctx: Context) {

}
