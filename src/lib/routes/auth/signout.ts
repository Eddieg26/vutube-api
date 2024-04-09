import {Context} from '../../services';
import {authenticate, route, tryRoute} from '../middleware';

async function signout(ctx: Context) {
  ctx.cookies.set('session', '');
  await ctx.services.redis.delete(`session:${ctx.state.session?.id}`);
}

export default route('/signout', authenticate(tryRoute(signout)));
