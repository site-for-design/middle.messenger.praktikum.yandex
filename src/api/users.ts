import fetch from "./HTTPTransportYaPraktikum";
import { User } from "./types";

export type ChangeUserPasswordData = {
  oldPassword: string;
  newPassword: string;
};

type GetUserByLoginData = {
  login: string;
};

export const changeUserProfile = async (data: User): Promise<User> => {
  return fetch.put(`/user/profile`, { data });
};

export const changeUserAvatar = async (data: FormData): Promise<User> => {
  return fetch.put(`/user/profile/avatar`, { data });
};

export const changeUserPassword = async (
  data: ChangeUserPasswordData,
): Promise<unknown> => {
  return fetch.put(`/user/password`, { data });
};

export const getUserByLogin = async (
  data: GetUserByLoginData,
): Promise<User[]> => {
  return fetch.post(`/user/search`, { data });
};
