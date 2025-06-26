import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RepairState {
  repairs: any[];
  repairDetail: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: RepairState = {
  repairs: [],
  repairDetail: null,
  loading: false,
  error: null,
};

const repairSlice = createSlice({
  name: "repair",
  initialState,
  reducers: {
    setRepairs(state, action: PayloadAction<any[]>) {
      state.repairs = action.payload;
    },
    setRepairDetail(state, action: PayloadAction<any>) {
      state.repairDetail = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setRepairs, setRepairDetail, setLoading, setError } = repairSlice.actions;
export default repairSlice.reducer;

