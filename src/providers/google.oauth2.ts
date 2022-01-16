import got from 'got';
import {User} from '../interfaces/User';
import {OAuth2} from '../OAuth2';

export class GoogleOAuth2 extends OAuth2 {
  async getAccessToken(requestToken: string, origin: string): Promise<string> {
    const url = `${this.options.accessTokenUrl}`;
    const body: {[key: string]: string} = {
      grant_type: 'authorization_code',
      client_id: this.options.clientID,
      client_secret: this.options.clientSecret,
      code: '' + requestToken,
      redirect_uri: origin + '/api/oauth2/redirect/GOOGLE',
    };
    const data: {access_token: string} = await got(url, {
      method: 'POST',
      form: body,
      // throwHttpErrors: false,
    }).json();
    return data.access_token;
  }

  getAuthorizeUrl(origin: string): string {
    return (
      this.options.authorizationUrl +
      `?client_id=${this.options.clientID}&redirect_uri=${origin}/api/oauth2/redirect/GOOGLE` +
      '&scope=openid%20profile%20email&response_type=code'
    );
  }

  async getUserInfo(accessToken: string): Promise<User> {
    const data = await got
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      )
      .json<{
        name: string;
        id: string;
        email: string;
      }>();
    console.log('google user info data: ', data);
    const user = {
      displayName: data.name,
      email: data.email,
      id: data.id,
      identityProvider: 'Google',
    };
    return user;
  }
}
