import { Request, Response, NextFunction } from 'express';
import { GeneralError } from './ErrorUtils';

const ErrorHandler = (err: GeneralError, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof GeneralError) {
    return res
      .status(err.getCode())
      .json({ error: err.message, debug: err.debug });
  }
  return res.status(500).json({ error: 'Internal Error.' });
};

export default ErrorHandler;