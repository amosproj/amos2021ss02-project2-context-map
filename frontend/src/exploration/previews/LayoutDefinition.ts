import TabDefinition from '../../routing/TabDefinition';

export default interface LayoutDefinition extends TabDefinition {
  label: string;
  filename: string;
  description: string;
}
