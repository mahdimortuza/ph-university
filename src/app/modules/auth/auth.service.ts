import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user exists

  const isUserExists = await User.findOne({ id: payload?.id });
  console.log(isUserExists);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'this user is not found!');
  }

  // checking if the user is already deleted
  const isDeleted = isUserExists?.isDeleted;

  console.log(isDeleted);
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'this user is already deleted!');
  }

  // checking if the user is already blocked
  const userStatus = isUserExists?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!');
  }

  // checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists.password,
  );
  console.log(isPasswordMatched);

  // Access granted: send AccessToken, RefreshToken

  return {};
};

export const AuthServices = {
  loginUser,
};
