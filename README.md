# express-oauth2-client

## Install

```
npm i express-oauth2-client express express-session
```

## Usage

### environment variables

```
# Comma separated list of providers (uppercase)
OAUTH2_PROVIDER_LIST=GITHUB,AZUREAD

# example for GITHUB
OAUTH2_GITHUB_CLIENT_ID=<your client id>
OAUTH2_GITHUB_CLIENT_SECRET=<your secret id>
OAUTH2_GITHUB_AUTHORIZATION_URL=https://github.com/login/oauth/authorize
OAUTH2_GITHUB_ACCESS_TOKEN_URL=https://github.com/login/oauth/access_token

# example for AZUREAD
OAUTH2_AZUREAD_CLIENT_ID=<your client id>
OAUTH2_AZUREAD_CLIENT_SECRET=<your secret id>
OAUTH2_AZUREAD_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OAUTH2_AZUREAD_ACCESS_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
```

Tips: use the [dotenv](https://github.com/motdotla/dotenv) node module to easily manage your environment variables.

### javascript example

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

## Documentation

You want to make button with `Connect with Github`, or `Connect with Azure AD` ?

This module is designed to help you with that.

How it works ?

An **authentication provider** offers the OAuth2 mechanism in order to let you put on your website buttons like "Connect with <provider>".

This module currently works with:

- Github
- Azure AD

### Prerequisites

1. `express` node module.
2. `express-session` node module because all users will be identified with session cookies.
3. configuring the client application within your providers (Github, Azure AD, etc.). You need to have information with:
   1. Application id
   2. Secret key
   3. authorization url
   4. access token url

### Environment variables

the `<provider>` name should be in uppercase.

Example:

```
# Comma separated list of providers (uppercase)
OAUTH2_PROVIDER_LIST=GITHUB,AZUREAD

# example for GITHUB
OAUTH2_GITHUB_CLIENT_ID=<your client id>
OAUTH2_GITHUB_CLIENT_SECRET=<your secret id>
OAUTH2_GITHUB_AUTHORIZATION_URL=https://github.com/login/oauth/authorize
OAUTH2_GITHUB_ACCESS_TOKEN_URL=https://github.com/login/oauth/access_token

# example for AZUREAD
OAUTH2_AZUREAD_CLIENT_ID=<your client id>
OAUTH2_AZUREAD_CLIENT_SECRET=<your secret id>
OAUTH2_AZUREAD_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OAUTH2_AZUREAD_ACCESS_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
```

To add a provider, add:

```
OAUTH2_PROVIDER_LIST=GITHUB,AZUREAD,<provider>

OAUTH2_<provider>_CLIENT_ID=<your client id>
OAUTH2_<provider>_CLIENT_SECRET=<your secret id>
OAUTH2_<provider>_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OAUTH2_<provider>_ACCESS_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
```

### the oauth2Client object

This module exports a singleton object `oauth2Client` with following properties:

- `oauth2Client.auth()`: a middleware to check if someone is authenticated. It returns a `401` response error if nobody is authenticated.
- `oauth2Client.router(options: {exposeTest: boolean})`: a router middleware that offers some route url paths:
  - `GET /auth/isConnected`: checks if a user is connected
  - `POST /auth/disconnect`: disconnects a user (if any is connected)
  - `POST /auth/afterLoginRoute`: set the url to go after a user have been just authenticated.
  - The connection process is done with the `/oauth2` routes:
    - `GET /oauth2/config`: get the `OAuth2Config` config object. This object gives a set of providers (Github, Azure AD, etc.) with the OAuth2 authorization url. All buttons `Connect with <provider>` should link to the provider authorization url.
    - `GET /redirect/:provider`: url to be redirected from the provider.
    - `/oauth2/test`: if the `exposeTest` option is set, you will have access to the test routes (for a quick demo).

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
