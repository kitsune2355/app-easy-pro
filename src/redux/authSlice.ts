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
    const user = await loginService(payload);
    if (!user.token || !user.id) {
      throw new Error('Invalid user data received');
    }
    
    return user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.response?.status === 401) {
      return thunkAPI.rejectWithValue('Invalid username or password');
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
