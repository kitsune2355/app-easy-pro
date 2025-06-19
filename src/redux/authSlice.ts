import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService, LoginPayload, LoginResponse } from '../service/authService';

interface AuthState {
  user: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  try {
    console.log('Login attempt with payload:', { ...payload, password: '[REDACTED]' });
    
    const user = await loginService(payload);
    console.log('Login service response:', { ...user, token: user.token ? '[TOKEN_PRESENT]' : '[NO_TOKEN]' });
    
    if (!user.token || !user.id) {
      console.error('Invalid user data - missing token or id:', { hasToken: !!user.token, hasId: !!user.id });
      throw new Error('Invalid user data received');
    }
    
    return user;
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      stack: error.stack
    });
    
    // Handle network errors
    if (!error.response) {
      return thunkAPI.rejectWithValue('Network error - please check your connection');
    }
    
    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      return thunkAPI.rejectWithValue('Invalid username or password');
    }
    
    if (error.response?.status === 403) {
      return thunkAPI.rejectWithValue('Access forbidden - account may be disabled');
    }
    
    if (error.response?.status === 500) {
      return thunkAPI.rejectWithValue('Server error - please try again later');
    }
    
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      'Login failed'
    );
  }
});



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
    restoreUser(state, action) {
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;
