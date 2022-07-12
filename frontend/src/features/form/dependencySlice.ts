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
    addQueryDependency: (state, action: PayloadAction<string[]>) => {
      const dependency = action.payload;
      if (!dependency.length) {
        state.inputDependencies = state.inputDependencies.filter(
          (d) => d.name !== "Query Dependencies"
        );
        return;
      }
      const queryDependencies = state.inputDependencies.find(
        (v) => v.name === "Query Dependencies"
      );
      if (queryDependencies) queryDependencies.children = dependency;
      else
        state.inputDependencies.push({
          name: "Query Dependencies",
          children: dependency,
        });
    },
  },
});

export const { setDependencies, resetDependencies, addQueryDependency } =
  dependenciesSlice.actions;

export const selectInputDependencies = (state: AppState) =>
  state.dependencies.inputDependencies;
export const selectOutputDependencies = (state: AppState) =>
  state.dependencies.outputDependencies;

export default dependenciesSlice.reducer;
