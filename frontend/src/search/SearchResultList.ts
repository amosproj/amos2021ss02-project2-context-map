import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../shared/schema';

export default interface SearchResultList {
  key: number | string;
  header: string;
  elements: {
    key: number | string;
    element: JSX.Element;
    entity:
      | EdgeDescriptor
      | EdgeTypeDescriptor
      | NodeDescriptor
      | NodeTypeDescriptor;
  }[];
}
