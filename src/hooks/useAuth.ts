import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { LoginPayload } from '../service/authService';
import { login, logout } from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const loginUser = (payload: LoginPayload) => {
    dispatch(login(payload));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const isLoggedIn = !!user;

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    loginUser,
    logoutUser,
  };
};