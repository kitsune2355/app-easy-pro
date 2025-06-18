import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RepairState {
  repairs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RepairState = {
  repairs: [],
  loading: false,
  error: null
};

const repairSlice = createSlice({
  name: 'repair',
  initialState,
  reducers: {
    setRepairs(state, action: PayloadAction<any[]>) {
      state.repairs = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

// ส่งออก repairReducer ที่สร้างขึ้นจาก createSlice
export const { setRepairs, setLoading, setError } = repairSlice.actions;
export default repairSlice.reducer;
