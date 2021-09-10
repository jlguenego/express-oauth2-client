import {Router} from 'express';
import {resolve} from 'path';
import {OAuth2Client} from './../OAuth2Client';

export const testRouter = (oauth2Client: OAuth2Client) => {
  const app = Router();

  app.use((req, res, next) => {
    // set EJS views.
    const views = '../../views';
    const expressApp = req.app;
    expressApp.set('view engine', 'ejs');
    expressApp.set('views', [
      resolve(__dirname, views), // gts typescript in src
      resolve(__dirname, '..', views), // gts compile in build/src
    ]);
    next();
  });

  app.get('/', (req, res) => {
    const user = oauth2Client.getUser(req);
    const config = oauth2Client.getConfig(req);
    req.session.afterLoginRoute = '/api/oauth2/test/';
    res.render('pages/index', {
      config,
      isConnected: user !== undefined,
      displayName: user?.displayName,
    });
  });

  app.get('/secret', oauth2Client.auth(), (req, res) => {
    console.log('giving secret');
    res.render('pages/secret');
  });

  app.get('/disconnect', (req, res) => {
    oauth2Client.disconnect(req);
    res.render('pages/disconnect');
  });

  return app;
};
