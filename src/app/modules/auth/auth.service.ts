import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user exists

  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'this user is not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  console.log(isDeleted);
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'this user is already deleted!');
  }

  // checking if the user is already blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!');
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    // Access granted: send AccessToken, RefreshToken
    throw new AppError(httpStatus.FORBIDDEN, 'password did not matched');

  // create token and send to the client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
