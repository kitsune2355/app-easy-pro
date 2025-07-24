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
  agency: string;
  role: 'admin' | 'employer';
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
  const response = await axios.post<any>(`${env.API_ENDPOINT}/login.php`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // Handle the case where API returns data wrapped in an array or object
  let userData = response.data;
  
  // If the response has a "0" key, extract the user data from it
  if (userData && typeof userData === 'object' && userData['0']) {
    userData = userData['0'];
  }
  
  // Validate that we have the required fields
  if (!userData || !userData.id || !userData.token) {
    console.error('Invalid API response structure:', response.data);
    throw new Error('Invalid response from server');
  }
  
  return userData as LoginResponse;
};

export const checkToken = async (token: string): Promise<boolean> => {
  const response = await axios.post<VerifyTokenResponse>(`${env.API_ENDPOINT}/verify_token.php`, { token });
  return response.data.success === true;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${env.API_ENDPOINT}/logout.php`);
};
