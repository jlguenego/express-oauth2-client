import {NextFunction, Request, Response, Router} from 'express';
import {
  OAuth2Config,
  OAuth2Options,
  OAuth2RouterOptions,
} from './interfaces/OAuth2';
import {User} from './interfaces/User';
import {getOrigin} from './misc';
import {OAuth2Factory} from './OAuth2Factory';
import {envOptions} from './options';
import {authRouter} from './router/auth.router';
import {oAuth2Router} from './router/oauth2.router';

export class OAuth2Client {
  constructor(public options: OAuth2Options) {}

  auth() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.session.user) {
        return res.status(401).end();
      }
      const user = req.session.user;
      req.user = user;
      next();
    };
  }

  disconnect(req: Request) {
    req.session.user = undefined;
    req.session.accessToken = undefined;
  }

  getConfig(req: Request): OAuth2Config {
    const origin = getOrigin(req);
    const config: OAuth2Config = {};
    for (const p of Object.keys(envOptions)) {
      const oauth2 = OAuth2Factory.get(p, envOptions);
      config[p] = {
        authorizationUrl: oauth2.getAuthorizeUrl(origin),
      };
    }
    return config;
  }

  getUser(req: Request): User | undefined {
    return req.session.user;
  }

  router(opts: Partial<OAuth2RouterOptions> = {}) {
    const app = Router();
    app.use('/auth', authRouter);
    app.use('/oauth2', oAuth2Router(this, opts));
    return app;
  }
}
