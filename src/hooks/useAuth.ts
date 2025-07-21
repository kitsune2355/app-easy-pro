import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { LoginPayload, LoginResponse } from '../service/authService';
import { login, logout } from '../redux/authSlice';
import { checkToken } from '../service/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { fetchNotifications } from '../service/notifyService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const loginUser = async (payload: LoginPayload) => {
    try {
      const response = await dispatch(login(payload));
      
      // Check if login was successful
      if (login.fulfilled.match(response)) {
        const userData = response.payload as LoginResponse;
        
        // บันทึกข้อมูลลง AsyncStorage
        await AsyncStorage.setItem('userToken', userData.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        await registerForPushNotificationsAsync();
        await dispatch(fetchNotifications({ isRead: null }))
        
        return { success: true };
      } else {
        // Handle login failure
        return { success: false, error: response.payload || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logoutUser = async () => {
    try {
      // ลบข้อมูลจาก AsyncStorage เมื่อ logout
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const isValid = await checkToken(token);
      if (isValid) {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const userData = JSON.parse(userInfo);
          dispatch({ type: 'auth/restoreUser', payload: userData });
          return true;
        }
      }
    }

    // Token invalid or no token
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    dispatch(logout());
    return false;
  } catch (error) {
    console.error('Error checking login status:', error);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    dispatch(logout());
    return false;
  }
};

  const isLoggedIn = !!user;

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    loginUser,
    logoutUser,
    checkLoginStatus,
  };
};
