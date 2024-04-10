export class VideoStorage {
  url: string;
  library: number;

  constructor(url: string, library: number) {
    this.url = url;
    this.library = library;
  }

  async createVideo(
    title: string,
    userid: string,
    thumbnailTime?: number
  ): Promise<number> {
    return 0;
  }

  async uploadVideo(videoId: number, video: Buffer): Promise<void> {
    return;
  }
}
