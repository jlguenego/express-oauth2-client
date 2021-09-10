import {Request} from 'express';
export const getOrigin = (req: Request) => {
  return req.protocol + '://' + req.headers.host;
};
