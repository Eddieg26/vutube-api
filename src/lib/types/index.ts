import {number, object, string, enum as zenum} from 'zod';

export class Config {
  port: number;
  env: Environment;
  dbUrl: string;
  jwtSecret: string;

  constructor() {
    this.port = process.env.PORT
      ? parseInt(process.env.PORT)
      : (undefined as unknown as number);
    this.env = process.env.ENV as Environment;
    this.dbUrl = process.env.DB_URL as string;
    this.jwtSecret = process.env.JWT_SECRET as string;
  }

  validate(): Config {
    const schema = Config.schema();
    const validated = schema.safeParse({
      port: this.port,
      env: this.env,
      dbUrl: this.dbUrl,
      jwtSecret: this.jwtSecret,
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
