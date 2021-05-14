export const nodeInfo = {
  fromDb: [
    {
      nodeType: ':`Person`',
      nodeLabels: ['Person'],
      propertyName: 'born',
      propertyTypes: ['Long'],
      mandatory: true,
    },
    {
      nodeType: ':`Person`',
      nodeLabels: ['Person'],
      propertyName: 'name',
      propertyTypes: ['String'],
      mandatory: true,
    },
    {
      nodeType: ':`Movie`',
      nodeLabels: ['Movie'],
      propertyName: 'tagline',
      propertyTypes: ['String'],
      mandatory: true,
    },
    {
      nodeType: ':`Movie`',
      nodeLabels: ['Movie'],
      propertyName: 'title',
      propertyTypes: ['String'],
      mandatory: true,
    },
    {
      nodeType: ':`Movie`',
      nodeLabels: ['Movie'],
      propertyName: 'released',
      propertyTypes: ['Long'],
      mandatory: true,
    },
  ],
  expected: [
    {
      name: 'Person',
      properties: [
        {
          name: 'born',
          types: ['Long'],
          mandatory: true,
        },
        {
          name: 'name',
          types: ['String'],
          mandatory: true,
        },
      ],
    },
    {
      name: 'Movie',
      properties: [
        {
          name: 'tagline',
          types: ['String'],
          mandatory: true,
        },
        {
          name: 'title',
          types: ['String'],
          mandatory: true,
        },
        {
          name: 'released',
          types: ['Long'],
          mandatory: true,
        },
      ],
    },
  ],
};

export const edgeInfo = {
  fromDb: [
    {
      relType: ':`ACTED_IN`',
      propertyName: 'roles',
      propertyTypes: ['StringArray'],
      mandatory: true,
    },
    {
      relType: ':`DIRECTED`',
      propertyName: null,
      propertyTypes: null,
      mandatory: false,
    },
  ],
  expected: [
    {
      name: 'ACTED_IN',
      properties: [
        {
          name: 'roles',
          types: ['StringArray'],
          mandatory: true,
        },
      ],
    },
    {
      name: 'DIRECTED',
      properties: [],
    },
  ],
};
