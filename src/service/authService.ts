import axios from 'axios';
import { env } from '../config/environment';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  tel: string;
  position: string;
  department: string;
  role: string;
  token: string;
  verify: string;
  status: 'success';
}

interface VerifyTokenResponse {
  success: boolean;
  message?: string;
  user?: {
    sub: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${env.API_ENDPOINT}/login.php`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};


export const checkToken = async (token: string): Promise<boolean> => {
  const response = await axios.post<VerifyTokenResponse>(`${env.API_ENDPOINT}/verify_token.php`, { token });
  return response.data.success === true;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${env.API_ENDPOINT}/logout.php`);
};

