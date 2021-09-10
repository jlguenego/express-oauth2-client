import {NextFunction, Request, Response, Router} from 'express';
import {authRouter} from './router/auth.router';
import {oAuth2Router} from './router/oauth2.router';

export class OAuth2Client {
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

  getAuthorizeUrl(provider: string) {
    return `http://authorize-${provider}.com`;
  }

  router() {
    const app = Router();
    app.use('/auth', authRouter);
    app.use('/oauth2', oAuth2Router);
    return app;
  }
}
