export interface OAuth2Options {
  [provider: string]: OAuth2ProviderOptions;
}

export interface OAuth2ProviderOptions {
  clientID: string;
  clientSecret: string;
  authorizationUrl: string;
  accessTokenUrl: string;
}

export interface OAuth2Config {
  [provider: string]: {
    authorizationUrl: string;
  };
}
