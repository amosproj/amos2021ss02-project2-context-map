import { Property } from '../entities/Property';

export default interface FilterModelEntry {
  key: string;
  values: Property[];
}
