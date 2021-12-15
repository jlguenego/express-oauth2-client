import {Request} from 'express';
export const getOrigin = (req: Request) => {
  if (req.session.afterLoginRoute) {
    const origin = req.session.afterLoginRoute.replace(
      /^(https?:\/\/.*?(:.*?)?)\/.*$/,
      '$1'
    );
    return origin;
  }
  const result =
    process.env.OAUTH2_ORIGIN || req.protocol + '://' + req.headers.host;
  return result;
};
