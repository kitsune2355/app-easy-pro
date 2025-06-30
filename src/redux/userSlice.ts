import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  user_name: string;
  user_fname?: string;
  user_tel: string;
  user_level: string;
  user_department_name: string;
}

interface UserState {
  user: User | null;
  userDetail: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  userDetail: null,
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    setUserDetail: (state, action: PayloadAction<User>) => {
      state.userDetail = action.payload;
      state.error = null;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.userDetail = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      if (state.userDetail) {
        state.userDetail = { ...state.userDetail, ...action.payload };
      }
    },
    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    }
  },
});

export const {
  setLoading,
  setError,
  setUser,
  setUserDetail,
  setUsers,
  clearUser,
  clearError,
  updateUser,
  restoreUser,
} = userSlice.actions;

export default userSlice.reducer;
