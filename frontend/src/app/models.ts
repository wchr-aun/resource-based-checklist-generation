export interface BaseComponent {
  componentType: string;
  css: string;
  editable: boolean;
  function: string;
  inputDependency: string;
  inputDependencyField: string;
  name: string;
  order: number;
  outputDependency: string;
  outputDependencyField: string;
  required: boolean;
  validation: string;
  value: string;
  children: BaseComponent[];
}

export interface Component extends BaseComponent {
  children: Component[];
  originalName: string;
}

export interface Template {
  components: BaseComponent[];
  processName: string;
}

export interface Form {
  processName: string;
  components: BaseComponent[];
}

export const COMPONENT_TYPE_LIST = [
  "HEADER",
  "INPUT",
  "PARAGRAPH",
  "DROPDOWN",
  "CHOICES",
  "CHECKBOXES",
  "DATE",
  "TIME",
];

export const COMPONENT_TYPES = {
  HEADER: "HEADER",
  INPUT: "INPUT",
  PARAGRAPH: "PARAGRAPH",
  DROPDOWN: "DROPDOWN",
  CHOICES: "CHOICES",
  CHECKBOXES: "CHECKBOXES",
  DATE: "DATE",
  TIME: "TIME",
};
