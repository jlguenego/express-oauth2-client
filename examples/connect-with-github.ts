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
  const origin = req.protocol + '://' + req.headers.host;
  res.render('pages/index', {
    authorizeUrl: oauth2Client.getAuthorizeUrl('GITHUB', origin),
  });
});

app.get('/secret', oauth2Client.auth(), (req, res) => {
  res.render('pages/secret');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
