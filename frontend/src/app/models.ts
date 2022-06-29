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

export interface Details {
  name: string;
  order: number;
  inputDependency: string;
  inputDependencyField: string;
  hide: boolean;
}

export interface Information {
  name: string;
  order: number;
  details: Details[];
}

export interface Form {
  processName: string;
  components: BaseComponent[];
  information: Information[];
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
  "TAB",
];

export enum COMPONENT_TYPES {
  HEADER = "HEADER",
  INPUT = "INPUT",
  PARAGRAPH = "PARAGRAPH",
  DROPDOWN = "DROPDOWN",
  CHOICES = "CHOICES",
  CHECKBOXES = "CHECKBOXES",
  DATE = "DATE",
  TIME = "TIME",
  TAB = "TAB",
}

export interface DependencyDetails {
  name: string;
  children: string[];
}

export interface Dependencies {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
}

export interface Template {
  id: number;
  name: string;
  created: Date;
  updated: Date;
}
