import {number, object, string, enum as zenum} from 'zod';

export type VideoStorageConfig = {
  url: string;
  cdn: string;
  library: number;
  key: string;
};

export class Config {
  port: number;
  env: Environment;
  dbUrl: string;
  jwtSecret: string;
  videoStorage: VideoStorageConfig;

  constructor() {
    this.port = process.env.PORT
      ? parseInt(process.env.PORT)
      : (undefined as unknown as number);
    this.env = process.env.ENV as Environment;
    this.dbUrl = process.env.DB_URL as string;
    this.jwtSecret = process.env.JWT_SECRET as string;
    this.videoStorage = {
      url: process.env.VIDEO_STORAGE_URL as string,
      cdn: process.env.VIDEO_STORAGE_CDN_URL as string,
      library: parseInt(process.env.VIDEO_STORAGE_LIBRARY as string),
      key: process.env.VIDEO_STORAGE_KEY as string,
    };
  }

  validate(): Config {
    const schema = Config.schema();
    const validated = schema.safeParse({
      port: this.port,
      env: this.env,
      dbUrl: this.dbUrl,
      jwtSecret: this.jwtSecret,
      videoStorage: this.videoStorage,
    });

    if (!validated.success) {
      console.error('Errors', validated.error.flatten().fieldErrors);
      throw new Error(validated.error.errors[0].message);
    }

    return this;
  }

  static schema() {
    return object({
      port: number(),
      env: zenum(['development', 'production', 'test'] as const),
      dbUrl: string(),
      jwtSecret: string(),
      videoStorage: object({
        url: string(),
        cdn: string(),
        library: number(),
        key: string(),
      }),
    });
  }
}

export type Environment = 'development' | 'production' | 'test';

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  VALIDATION = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export class ServerError extends Error {
  status: StatusCode;
  meta?: Record<string, unknown>;

  constructor(
    status: StatusCode,
    message: string,
    meta?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.meta = meta;
  }

  data() {
    return {
      status: this.status,
      message: this.message,
      meta: this.meta,
    };
  }

  static raise(
    status: StatusCode,
    message: string,
    meta?: Record<string, unknown>
  ) {
    return new ServerError(status, message, meta);
  }
}

export type Result<T> =
  | {data: T; error: undefined}
  | {data: undefined; error: ServerError};
