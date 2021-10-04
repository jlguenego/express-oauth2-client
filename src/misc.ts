import {Request} from 'express';
export const getOrigin = (req: Request) => {
  return process.env.OAUTH2_ORIGIN || req.protocol + '://' + req.headers.host;
};
