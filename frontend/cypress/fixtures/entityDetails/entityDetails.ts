import { Node } from '../../../src/shared/entities';

export const id1: Node = {
  id: 1,
  types: ['Customer'],
  properties: {
    country: 'UK',
    contactTitle: 'Sales Representative',
    address: 'Fauntleroy Circus',
    city: 'London',
  },
};

export const dummies: Node[] = [
  {
    id: 1,
    types: ['Customer'],
    properties: {
      country: 'UK',
      contactTitle: 'Sales Representative',
      address: 'Fauntleroy Circus',
      city: 'London',
    },
  },
  {
    id: 2,
    types: ['Product'],
    properties: {
      reorderLevel: 5,
      unitsInStock: 101,
      unitPrice: 15,
      supplierID: '17',
      productID: '73',
    },
  },
  {
    id: 3,
    types: ['Order'],
    properties: {
      shipCity: 'Boise',
      orderID: '10847',
      freight: '487.57',
      requiredDate: '1998-02-05 00:00:00.000',
      employeeID: '4',
    },
  },
  {
    id: 4,
    types: ['Supplier'],
    properties: {
      country: 'Germany',
      contactTitle: 'Coordinator Foreign Markets',
      address: 'Frahmredder 112a',
      supplierID: '13',
      city: 'Cuxhaven',
    },
  },
];
