import {Context} from '../../services';
import {StatusCode} from '../../types';
import {object, string, date} from 'zod';
import {usersTable} from '../../models';
import {eq} from 'drizzle-orm';
import {first} from 'radash';

const sessionSchema = object({
  id: string(),
  userId: string(),
  expiresAt: date(),
});

export function authenticate(route: (ctx: Context) => Promise<void>) {
  return async (ctx: Context) => {
    if (!ctx.cookies.get('session')) {
      ctx.status = StatusCode.UNAUTHORIZED;
      ctx.body = 'Unauthorized';
      return;
    }

    const parsed = JSON.parse(ctx.cookies.get('session') ?? '');
    const validated = sessionSchema.safeParse({
      id: parsed.id,
      userId: parsed.userId,
      expiresAt: new Date(parsed.expiresAt),
    });

    if (!validated.success) {
      ctx.status = StatusCode.UNAUTHORIZED;
      ctx.body = 'Session invalid';
      return;
    }

    if (validated.data.expiresAt < new Date()) {
      ctx.services.redis.delete(`session:${validated.data.id}`);
      ctx.cookies.set('session', '');
      ctx.status = StatusCode.UNAUTHORIZED;
      ctx.body = 'Session expired';
      return;
    }

    const user = first(
      await ctx.services.database
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, validated.data.userId))
    );

    if (!user) {
      ctx.services.redis.delete(`session:${validated.data.id}`);
      ctx.cookies.set('session', '');
      ctx.status = StatusCode.UNAUTHORIZED;
      ctx.body = 'User not found';
      return;
    }

    ctx.state.session = validated.data;
    ctx.state.user = user;

    await route(ctx);
  };
}
