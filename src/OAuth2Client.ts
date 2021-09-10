import {NextFunction, Request, Response, Router} from 'express';
import {OAuth2Options} from './interfaces/OAuth2';
import {OAuth2Factory} from './OAuth2Factory';
import {options} from './options';
import {authRouter} from './router/auth.router';
import {oAuth2Router} from './router/oauth2.router';

export class OAuth2Client {
  constructor(private options: OAuth2Options) {}
  auth() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.session.user) {
        console.log('not connected.');
        return res.status(401).end();
      }
      const user = req.session.user;
      req.user = user;
      next();
    };
  }

  getAuthorizeUrl(provider: string, origin: string) {
    const oauth2 = OAuth2Factory.get(provider, options);
    return oauth2.getAuthorizeUrl(origin);
  }

  router() {
    const app = Router();
    app.use('/auth', authRouter);
    app.use('/oauth2', oAuth2Router(options));
    return app;
  }
}
