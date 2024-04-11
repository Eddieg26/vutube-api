import multer = require('@koa/multer');
import {api} from '../api';
import {ServerError, StatusCode, Result, VideoStorageConfig} from '../types';
import {tryit} from 'radash';

type CreateResponse = {
  videoId: string;
};

type UploadResponse = {
  success: boolean;
  message: string;
  statusCode: StatusCode;
};
export class VideoStorage {
  url: string;
  cdn: string;
  library: number;
  key: string;

  constructor(config: VideoStorageConfig) {
    this.url = config.url;
    this.cdn = config.cdn;
    this.library = config.library;
    this.key = config.key;
  }

  async createVideo(
    title: string,
    userId: string,
    thumbnailTime?: number
  ): Promise<Result<CreateResponse>> {
    const url = `${this.url}/library/${this.library}/videos`;
    const post = {title, collectionId: userId, thumbnailTime};
    const headers = {'Content-Type': 'application/json', AccessKey: this.key};
    const [error, data] = await tryit(api.post)<{guid: string}>(url, post, {
      headers,
    });

    if (error) return {error: error as ServerError, data: undefined};
    return {data: {videoId: data.guid}, error: undefined};
  }

  async uploadVideo(
    videoId: string,
    video: multer.File
  ): Promise<UploadResponse> {
    const url = `${this.url}/library/${this.library}/videos/${videoId}`;
    const form = new FormData();
    form.append('file', video);

    const [error, data] = await tryit(api.put)<UploadResponse>(url, video, {
      headers: {'Content-Type': 'video/mp4', AccessKey: this.key},
    });

    if (error)
      return {
        success: false,
        message: error.message,
        statusCode: StatusCode.SERVER_ERROR,
      };
    return data;
  }

  getHLSUrl(videoId: string) {
    return `${this.cdn}/${videoId}/playlist.m3u8`;
  }
}
