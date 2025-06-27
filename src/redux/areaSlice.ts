import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Room {
  ar_id: number;
  ar_name: string;
  [key: string]: any;
}

interface Floor {
  ac_id: number;
  ac_name: string;
  room: Room[];
  [key: string]: any;
}

interface Building {
  area_id: number;
  area_name: string;
  floor: Floor[];
  [key: string]: any;
}

interface AreaState {
  buildings: Building[];
  loading: boolean;
  error: string | null;
}

const initialState: AreaState = {
  buildings: [],
  loading: false,
  error: null,
};

const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    setAreaStructure(state, action: PayloadAction<Building[]>) {
      state.buildings = action.payload;
    },
    setAreaLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAreaError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAreaStructure, setAreaLoading, setAreaError } = areaSlice.actions;
export default areaSlice.reducer;
