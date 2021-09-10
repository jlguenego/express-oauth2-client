import {Router} from 'express';
import '../modules';
import {OAuth2Factory} from '../OAuth2Factory';
import {OAuth2RouterOptions} from './../interfaces/OAuth2';
import {getOrigin} from './../misc';
import {OAuth2Client} from './../OAuth2Client';
import {testRouter} from './test.router';

const app = Router();

export const oAuth2Router = (
  client: OAuth2Client,
  routerOptions: Partial<OAuth2RouterOptions>
) => {
  const routerOpts: OAuth2RouterOptions = {
    exposeTest: false,
    ...routerOptions,
  };

  if (routerOpts.exposeTest) {
    app.use('/test', testRouter(client));
  }

  const options = client.options;
  app.get('/config', (req, res) => {
    res.json(client.getConfig(req));
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
          getOrigin(req)
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
