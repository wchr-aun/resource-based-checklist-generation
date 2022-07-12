import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "@app/store";

export interface ProcessInputState {
  loading: boolean;
}

const initialState: ProcessInputState = {
  loading: false,
};

export const loadingSlice = createSlice({
  name: "processInput",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export const selectLoading = (state: AppState) => state.loading.loading;

export default loadingSlice.reducer;
