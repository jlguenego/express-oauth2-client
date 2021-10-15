import got from 'got';
import {User} from '../interfaces/User';
import {OAuth2} from '../OAuth2';

export class GithubOAuth2 extends OAuth2 {
  async getAccessToken(requestToken: string): Promise<string> {
    const url =
      this.options.accessTokenUrl +
      `?client_id=${this.options.clientID}&code=${requestToken}&client_secret=${this.options.clientSecret}`;
    const data: {access_token: string} = await got.post(url).json();
    return data.access_token;
  }

  getAuthorizeUrl(origin: string): string {
    return (
      this.options.authorizationUrl +
      `?client_id=${this.options.clientID}&redirect_uri=${origin}/api/oauth2/redirect/GITHUB`
    );
  }

  async getUserInfo(accessToken: string): Promise<User> {
    const data = await got
      .get('https://api.github.com/user', {
        headers: {
          // This header informs the Github API about the API version
          Accept: 'application/vnd.github.v3+json',
          // Include the token in the Authorization header
          Authorization: 'token ' + accessToken,
        },
      })
      .json<{name: string; email: string; login: string}>();
    const user = {
      displayName: data.name,
      email: data.email,
      id: data.login,
      identityProvider: 'github',
    };
    return user;
  }
}
