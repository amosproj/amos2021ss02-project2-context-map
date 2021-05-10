import React from 'react';
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
];

/**
 * Creates a linked card with icon, description and subtitle
 * for the dashboard based on a tab label from the routes.
 * @param tab TabDefinition (based on the routes)
 * @returns new to render a card component
 */
const createCard = function createCardBasedOnTab(
  tab: TabDefinition
): CardDefinition {
  const card = cardContents.find((content) => content.label === tab.label);

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
