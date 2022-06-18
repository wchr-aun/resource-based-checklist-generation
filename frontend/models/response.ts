export interface Component {
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
  children?: Component[];
}

export interface Template {
  components: Component[];
  processName: string;
}
