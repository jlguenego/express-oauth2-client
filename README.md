# express-oauth2-client

## Install

```
npm i express-oauth2-client express express-session
```

## Usage

```js
const express = require('express');
const session = require('express-session');
const {oauth2Client} = require('express-oauth2-client');

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
