import CardDefinition from './CardDefinition';
import TabDefinition from '../../routing/TabDefinition';

interface CardPresentationContent {
  label: string;
  subLabel: string;
  description: string;
  icon: string;
}

const cardContents: Array<CardPresentationContent> = [
  {
    label: 'Graph',
    subLabel: '2D network-based visualization',
    description: 'The first graph visualisation that you can see here.',
    icon: 'timeline',
  },
  {
    label: 'Schema',
    subLabel: 'Database insights',
    description: 'Take a deeper look into the database structure',
    icon: 'account_tree',
  },
  {
    label: 'Hierarchies',
    subLabel: 'Node relations',
    description: 'Display queried data in a hierarchically structured graph.',
    icon: 'device_hub',
  },
  {
    label: 'Chord Diagram',
    subLabel: 'Edge visualization',
    description: 'Get an overview of how nodes are connected to each other.',
    icon: 'donut_large',
  },
];

/**
 * Creates a new card definition with icon, description and subtitle for the dashboard from a TabDefinition.
 * @param tab A {@link TabDefinition} (based on the routes)
 * @returns the created card definition.
 */
const createCard = function createCardBasedOnTab(
  tab: TabDefinition
): CardDefinition {
  const card = cardContents.find((content) => content.label === tab.label);

  /* istanbul ignore if */
  if (card === undefined) {
    throw new Error(`No card content found to tab label ${tab.label}`);
  }

  return {
    label: tab.label,
    path: tab.path,
    content: tab.content,
    description: card.description,
    subLabel: card.subLabel,
    icon: card.icon,
  };
};

export default createCard;
