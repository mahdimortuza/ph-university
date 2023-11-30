import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
const app: Application = express();

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'route not found',
    error: '',
  });
};
export default notFound;
