import { Dependencies, DependencyDetails } from "@models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "@app/store";

export interface ForeignTableState {
  foreign: {
    [key: string]: {
      foreignKey: string;
      queryTable: string;
      fields: string[];
      array: boolean;
    }[];
  };
}

const initialState: ForeignTableState = {
  foreign: {},
};

export const foreignTableSlice = createSlice({
  name: "foreignTable",
  initialState,
  reducers: {
    setForeignTable: (
      state,
      action: PayloadAction<{
        foreign: {
          foreignKey: string;
          queryTable: string;
          fields: string[];
          array: boolean;
        }[];
        key: string;
      }>
    ) => {
      const { foreign, key } = action.payload;
      state.foreign[key] = foreign.map((f) => ({
        foreignKey: f.foreignKey,
        queryTable: f.queryTable,
        fields: f.fields,
        array: f.array,
      }));
    },
    resetForeignTable: (state) => {
      state.foreign = {};
    },
  },
});

export const { setForeignTable, resetForeignTable } = foreignTableSlice.actions;

export const selectForeign = (state: AppState) => state.foreignTable.foreign;

export default foreignTableSlice.reducer;
