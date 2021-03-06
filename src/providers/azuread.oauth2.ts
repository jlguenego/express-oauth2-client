import got from 'got';
import {User} from '../interfaces/User';
import {OAuth2} from '../OAuth2';

export class AzureADOAuth2 extends OAuth2 {
  async getAccessToken(requestToken: string, origin: string): Promise<string> {
    const url = `${this.options.accessTokenUrl}`;
    const body: {[key: string]: string} = {
      grant_type: 'authorization_code',
      client_id: this.options.clientID,
      client_secret: this.options.clientSecret,
      code: '' + requestToken,
      redirect_uri: origin + '/api/oauth2/redirect/AZUREAD',
    };
    try {
      const data: {access_token: string} = await got(url, {
        method: 'POST',
        form: body,
        // throwHttpErrors: false,
      }).json();
      return data.access_token;
    } catch (err) {
      console.error('Microsoft API returns an error on url: ', url);
      console.error('body', body);
      console.error('err: ', err);
      throw err;
    }
  }

  getAuthorizeUrl(origin: string): string {
    return (
      this.options.authorizationUrl +
      `?client_id=${this.options.clientID}&redirect_uri=${origin}/api/oauth2/redirect/AZUREAD` +
      '&scope=User.Read&response_type=code'
    );
  }

  async getUserInfo(accessToken: string): Promise<User> {
    const url = 'https://graph.microsoft.com/v1.0/me';
    try {
      const data = await got
        .get(url, {
          headers: {
            // Include the token in the Authorization header
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .json<{
          displayName: string;
          userPrincipalName: string;
          surname: string;
        }>();
      const user = {
        displayName: data.displayName,
        email: data.userPrincipalName,
        id: data.surname,
        identityProvider: 'azure AD',
      };
      return user;
    } catch (err) {
      console.error('error while calling url: ', url);
      console.error('accessToken: ', accessToken);
      console.error('err: ', err);
      throw err;
    }
  }
}
