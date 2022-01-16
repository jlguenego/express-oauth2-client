import {OAuth2Options} from './interfaces/OAuth2';
import {OAuth2} from './OAuth2';
import {AzureADOAuth2} from './providers/azuread.oauth2';
import {GithubOAuth2} from './providers/github.oauth2';
import {GoogleOAuth2} from './providers/google.oauth2';
import {TestProviderOAuth2} from './providers/testprovider.oauth2';

export class OAuth2Factory {
  static get(provider: string, options: OAuth2Options): OAuth2 {
    const o = options[provider];
    if (provider === 'GITHUB') {
      return new GithubOAuth2(o);
    }
    if (provider === 'AZUREAD') {
      return new AzureADOAuth2(o);
    }
    if (provider === 'GOOGLE') {
      return new GoogleOAuth2(o);
    }
    if (provider === 'TESTPROVIDER') {
      return new TestProviderOAuth2(o);
    }
    throw new Error(`Provider unknown: ${provider}`);
  }
}
