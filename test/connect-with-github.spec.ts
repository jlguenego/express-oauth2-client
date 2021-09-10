import express from 'express';
import session from 'express-session';
import {oauth2Client} from '../src';

const app = express();
app.set('view engine', 'ejs');
app.use(
  session({
    name: 'test-app.sid',
    secret: 'do not change this secret or all session will be reset...',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(oauth2Client());

app.get('/', (req, res) => {
  res.render('pages/index', {authorizeUrl: 'http://hello.com'});
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
