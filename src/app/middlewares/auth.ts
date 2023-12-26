import httpStatus from 'http-status';
import { AppError } from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized.');
    }
    next();
  });
};

export default auth;
