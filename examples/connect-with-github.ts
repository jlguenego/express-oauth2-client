import express from 'express';
import session from 'express-session';
import {resolve} from 'path';
import {oauth2Client} from '../src';

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));

app.use(
  session({
    name: 'test-app.sid',
    secret: 'do not change this secret or all session will be reset...',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/api', oauth2Client.router());

app.get('/', (req, res) => {
  const user = oauth2Client.getUser(req);
  res.render('pages/index', {
    authorizeUrl: oauth2Client.getAuthorizeUrl('GITHUB', req),
    isConnected: user !== undefined,
    displayName: user?.displayName,
  });
});

app.get('/secret', oauth2Client.auth(), (req, res) => {
  console.log('giving secret');
  res.render('pages/secret');
});

app.get('/disconnect', oauth2Client.auth(), (req, res) => {
  oauth2Client.disconnect(req);
  res.render('pages/disconnect');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
