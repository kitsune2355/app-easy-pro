import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../interfaces/user.interface';

interface UserState {
  user: IUser | null;
  userDetail: IUser | null;
  users: IUser[];
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
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.error = null;
    },
    setUserDetail: (state, action: PayloadAction<IUser>) => {
      state.userDetail = action.payload;
      state.error = null;
    },
    setUsers: (state, action: PayloadAction<IUser[]>) => {
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
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      if (state.userDetail) {
        state.userDetail = { ...state.userDetail, ...action.payload };
      }
    },
    restoreUser: (state, action: PayloadAction<IUser>) => {
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
