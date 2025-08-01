import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJobType, IServiceType } from "../interfaces/repair.interface";

interface RepairState {
  repairs: any[];
  repairDetail: any | null;
  serviceType: IServiceType[] | null;
  jobType: IJobType[] | null;
  selectedServiceType: IServiceType | null;
  selectedJobType: IJobType | null;
  loading: boolean;
  error: string | null;
}

const initialState: RepairState = {
  repairs: [],
  repairDetail: null,
  serviceType: [],
  jobType: [],
  selectedServiceType: null,
  selectedJobType: null,
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
    setServiceType(state, action: PayloadAction<any[]>) {
      state.serviceType = action.payload;
    },
    setJobType(state, action: PayloadAction<any[]>) {
      state.jobType = action.payload;
    },
    setSelectedServiceType(state, action: PayloadAction<IServiceType>) {
      state.selectedServiceType = action.payload;
    },
    setSelectedJobType(state, action: PayloadAction<IJobType>) {
      state.selectedJobType = action.payload;
    },
    updateHasFeedback(state, action: PayloadAction<number>) {
      if (state.repairDetail) {
        state.repairDetail.has_feedback = action.payload;
      }
    },
  },
});

export const {
  setRepairs,
  setRepairDetail,
  setLoading,
  setError,
  setServiceType,
  setJobType,
  setSelectedServiceType,
  setSelectedJobType,
  updateHasFeedback,
} = repairSlice.actions;
export default repairSlice.reducer;
