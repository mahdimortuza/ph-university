import { TUser } from '../user/user.interface';

const LoginUser = async (payload: TUser) => {
  console.log(payload);
  return {};
};

export const AuthServices = {
  LoginUser,
};
