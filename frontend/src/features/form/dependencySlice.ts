import { Dependencies, DependencyDetails } from "@models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "@app/store";

export interface DependenciesState {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
}

const initialState: DependenciesState = {
  inputDependencies: [],
  outputDependencies: [],
};

export const dependenciesSlice = createSlice({
  name: "dependencies",
  initialState,
  reducers: {
    setDependencies: (state, action: PayloadAction<Dependencies>) => {
      const { inputDependencies, outputDependencies } = action.payload;
      state.inputDependencies = inputDependencies;
      state.outputDependencies = outputDependencies;
    },
    resetDependencies: (state) => {
      state.inputDependencies = [];
      state.outputDependencies = [];
    },
  },
});

export const { setDependencies, resetDependencies } = dependenciesSlice.actions;

export const selectInputDependencies = (state: AppState) =>
  state.dependencies.inputDependencies;
export const selectOutputDependencies = (state: AppState) =>
  state.dependencies.outputDependencies;

export default dependenciesSlice.reducer;
