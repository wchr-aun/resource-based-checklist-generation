import { Component, Template } from "@models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface FormState {
  processName: string;
  components: Component[];
}

const initialState: FormState = {
  processName: "",
  components: [],
};

const getNode = (prefix: string, components: Component[]) => {
  const splitedPrefix = prefix.split(".").slice(1);

  let curr = components;
  let node: Component = {} as Component;
  splitedPrefix.forEach((p) => {
    const temp = curr.find((v) => v.name === p);
    if (temp) node = temp;
    if (temp?.children) curr = temp.children;
  });

  return node;
};

export const formSlice = createSlice({
  name: "process",
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<Template>) => {
      const { processName, components } = action.payload;
      state.processName = processName;
      state.components = components;
    },
    updateComponent: (
      state,
      action: PayloadAction<{
        prefix: string;
        field: "componentType" | "validation";
        value: string;
      }>
    ) => {
      const { prefix, field, value } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node[field] = value;
    },
    addNewField: (state, action: PayloadAction<string>) => {
      const prefix = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children.push({
        name: `New Field - (${node.children.length + 1})`,
        componentType: "INPUT",
        css: "",
        editable: false,
        function: "",
        required: false,
        inputDependency: "",
        inputDependencyField: "",
        outputDependency: "",
        outputDependencyField: "",
        validation: "",
        value: "",
        order: node.children.reduce((p, c) => Math.max(p, c.order), 0) + 1,
        children: [],
      });
    },
    addNewModel: (state) => {
      state.components = [
        ...state.components,
        {
          name: `New Model - (${state.components.length + 1})`,
          componentType: "HEADER",
          css: "",
          editable: false,
          function: "",
          required: false,
          inputDependency: "",
          inputDependencyField: "",
          outputDependency: "",
          outputDependencyField: "",
          validation: "",
          value: "",
          order: state.components.reduce((p, c) => Math.max(p, c.order), 0) + 1,
          children: [],
        },
      ];
    },
    resetForm: (state) => {
      state = initialState;
    },
  },
});

export const { setForm, updateComponent, addNewField, addNewModel, resetForm } =
  formSlice.actions;

export const selectProcessName = (state: AppState) => state.form.processName;
export const selectComponents = (state: AppState) => state.form.components;

export default formSlice.reducer;
