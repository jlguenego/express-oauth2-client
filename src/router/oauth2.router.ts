import {Router} from 'express';
import {getOrigin} from '../misc';
import '../modules';
import {OAuth2Factory} from '../OAuth2Factory';
import {OAuth2Config, OAuth2Options} from './../interfaces/OAuth2';

const app = Router();

export const oAuth2Router = (options: OAuth2Options) => {
  app.get('/config', (req, res) => {
    const origin = getOrigin(req);
    const config: OAuth2Config = {};
    for (const p of Object.keys(options)) {
      const oauth2 = OAuth2Factory.get(p, options);
      config[p] = {
        authorizationUrl: oauth2.getAuthorizeUrl(origin),
      };
    }
    res.json(config);
  });

  app.get('/redirect/:provider', (req, res) => {
    const p = req.params.provider;
    (async () => {
      try {
        const requestToken = req.query.code as string;
        if (!requestToken) {
          throw new Error('The requestToken is not defined.');
        }
        const oauth2 = OAuth2Factory.get(p, options);
        const accessToken = await oauth2.getAccessToken(
          requestToken,
          req.baseUrl
        );

        const user = await oauth2.getUserInfo(accessToken);
        req.session.user = user;
        res.redirect(req.session.afterLoginRoute || '/');
      } catch (error) {
        console.log('error: ', error);
        res.status(500).end();
      }
    })();
  });

  return app;
};
