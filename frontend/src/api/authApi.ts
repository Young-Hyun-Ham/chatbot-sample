import { api } from './axios';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  email: string;
  username: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
};

export const axiosLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const register = async (payload: RegisterPayload): Promise<void> => {
  await api.post('/auth/register', payload);
};