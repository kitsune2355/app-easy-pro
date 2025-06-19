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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse[]>(`${env.API_ENDPOINT}/login.php`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const [user] = response.data;
  return user;
};
