import {User} from '../interfaces/User';
import {OAuth2} from '../OAuth2';

export class TestProviderOAuth2 extends OAuth2 {
  async getAccessToken(requestToken: string): Promise<string> {
    return requestToken + '_access_token';
  }

  getAuthorizeUrl(origin: string): string {
    return (
      this.options.authorizationUrl +
      `?client_id=${this.options.clientID}&redirect_uri=${origin}/api/oauth2/redirect/TESTPROVIDER`
    );
  }

  async getUserInfo(): Promise<User> {
    const user = {
      displayName: 'John Doe',
      email: 'john.doe@testprovider.org',
      id: 'johndoe',
      identityProvider: 'testprovider',
    };
    return user;
  }
}
