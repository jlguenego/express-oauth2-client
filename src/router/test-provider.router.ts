import {Router} from 'express';

export const testProviderRouter = () => {
  const app = Router();

  app.get('/authorize', (req, res) => {
    const redirectUrl = req.query.redirect_uri as string;
    if (typeof redirectUrl !== 'string' || redirectUrl === '') {
      res.status(400).end('redirect_uri missing in query string.');
      return;
    }
    res.redirect(`${redirectUrl}?code=provider_test_code`);
  });

  return app;
};
