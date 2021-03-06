import {Router} from 'express';
import '../modules';

const app = Router();

export const authRouter = app;

app.get('/isConnected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).end();
  }
  return res.json(req.session.user);
});

app.post('/disconnect', (req, res) => {
  req.session.user = undefined;
  req.session.accessToken = undefined;
  req.session.afterLoginRoute = undefined;
  res.status(204).end();
});

app.post('/afterLoginRoute', (req, res) => {
  try {
    const {url} = req.body as {url: string};
    req.session.afterLoginRoute = url;
    res.status(201).end();
  } catch (err) {
    res.status(500).end();
  }
});
