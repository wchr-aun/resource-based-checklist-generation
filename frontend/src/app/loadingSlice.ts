import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "@app/store";

export interface ProcessInputState {
  loading: number;
}

const initialState: ProcessInputState = {
  loading: 0,
};

export const loadingSlice = createSlice({
  name: "processInput",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload ? state.loading + 1 : state.loading - 1;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export const selectLoading = (state: AppState) => state.loading.loading;

export default loadingSlice.reducer;
