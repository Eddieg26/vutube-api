import {Context} from '../../services';
import {authenticate, route, tryRoute} from '../middleware';

async function signout(ctx: Context) {
  ctx.cookies.set('session', '');
}

export default route('/signout', authenticate(tryRoute(signout)));
