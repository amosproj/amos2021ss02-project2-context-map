export default interface TabDefinition {
  path: string;
  exact?: boolean | undefined;
  label: string;
  content: () => JSX.Element;
}
