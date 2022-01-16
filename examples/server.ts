import express from 'express';
import session from 'express-session';
import {oauth2Client} from '../src';

const port = +(process.env.PORT || 3000);

const app = express();

app.use(
  session({
    name: 'test-app.sid',
    secret: '$keep this secret$',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/api', oauth2Client.router({exposeTest: true}));

app.use('/hello', oauth2Client.auth(), (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.redirect('/api/oauth2/test/');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
