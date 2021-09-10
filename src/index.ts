import {NextFunction, Request, Response} from 'express';

export const oauth2Client = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // comment
    console.log('oauth2Client', next);
    throw new Error('oups');
    // next();
  };
};
