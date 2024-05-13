import dayjs = require('dayjs');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');
import { v4 as uuid } from 'uuid';
import { date, object, string } from 'zod';
import { Context } from '.';
import { Session } from '../models';
import { StatusCode } from '../types';

const sessionSchema = object({
  id: string(),
  userId: string(),
  expiresAt: date(),
});

export class Auth {
  constructor() {}

  createSession(userId: string): Session {
    return {id: uuid(), userId, expiresAt: dayjs().add(1, 'month').toDate()};
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  readSessionCookie(ctx: Context): Session | null {
    const session = ctx.cookies.get('session');
    if (!session) return null;

    const decoded = jwt.verify(session, ctx.state.config.jwtSecret) as Record<
      string,
      unknown
    >;
    const validated = sessionSchema.safeParse({
      id: decoded.id,
      userId: decoded.userId,
      expiresAt: new Date(decoded.expiresAt as string),
    });

    if (!validated.success) return null;
    return validated.data;
  }

  setSessionCookie(ctx: Context, session: Session) {
    const token = jwt.sign(session, ctx.state.config.jwtSecret, {
      expiresIn: '30d',
    });

    ctx.cookies.set('session', token, {
      secure: ctx.state.config.env === 'production',
      expires: session.expiresAt,
    });
  }

  setUnauthorized(ctx: Context, message: string) {
    ctx.status = StatusCode.UNAUTHORIZED;
    ctx.body = message;
    ctx.cookies.set('session', '');
  }
}
