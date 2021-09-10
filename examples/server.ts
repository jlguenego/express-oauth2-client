import express from 'express';
import session from 'express-session';
import {oauth2Client} from '../src';

const app = express();

app.use(
  session({
    name: 'test-app.sid',
    secret: 'do not change this secret or all session will be reset...',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/api', oauth2Client.router({exposeTest: true}));

app.get('/', (req, res) => {
  res.redirect('/api/oauth2/test/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
