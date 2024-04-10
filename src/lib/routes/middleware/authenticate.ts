import {Context} from '../../services';
import {findUserById} from '../helpers';

export function authenticate(route: (ctx: Context) => Promise<void>) {
  return async (ctx: Context) => {
    const {auth, database} = ctx.services;
    
    const session = auth.readSessionCookie(ctx);
    if (!session) return auth.setUnauthorized(ctx, 'Unauthorized');

    if (session.expiresAt < new Date())
      return auth.setUnauthorized(ctx, 'Session expired');

    const user = await findUserById(database, session.userId);
    if (!user) return auth.setUnauthorized(ctx, 'User not found');

    ctx.state.session = session;
    ctx.state.user = user;

    await route(ctx);
  };
}
