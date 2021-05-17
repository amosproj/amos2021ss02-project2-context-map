export const getNodeTypeFilterModelResult = {
  name: 'Movie',
  properties: [
    {
      key: 'title',
      values: ['The Matrix'],
    },
    {
      key: 'tagline',
      values: ['Welcome to the Real World'],
    },
    {
      key: 'released',
      values: [1999],
    },
  ],
};

export const getEdgeTypeFilterModelResult = {
  name: 'ACTED_IN',
  properties: [
    {
      key: 'roles',
      values: [['Trinity'], ['Neo']],
    },
  ],
};
