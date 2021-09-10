import {OAuth2ProviderOptions} from './interfaces/OAuth2';
import {User} from './interfaces/User';

export abstract class OAuth2 {
  constructor(protected options: OAuth2ProviderOptions) {}
  abstract getAccessToken(
    requestToken: string,
    origin: string
  ): Promise<string>;

  abstract getUserInfo(accessToken: string): Promise<User>;

  abstract getAuthorizeUrl(origin: string): string;
}
