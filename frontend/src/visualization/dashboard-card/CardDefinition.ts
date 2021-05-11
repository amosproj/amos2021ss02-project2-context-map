import TabDefinition from '../../routing/TabDefinition';

export default interface CardDefinition extends TabDefinition{
  label: string;
  subLabel: string;
  description: string;
  icon: string;
}
