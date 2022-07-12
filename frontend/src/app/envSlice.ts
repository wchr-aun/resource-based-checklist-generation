import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "@app/store";

export interface ProcessInputState {
  env: "healthcare" | "payment";
}

const initialState: ProcessInputState = {
  env: "healthcare",
};

export const envSlice = createSlice({
  name: "processInput",
  initialState,
  reducers: {
    setEnv: (state, action: PayloadAction<"healthcare" | "payment">) => {
      state.env = action.payload;
    },
  },
});

export const { setEnv } = envSlice.actions;

export const selectEnv = (state: AppState) => state.env.env;

export default envSlice.reducer;
