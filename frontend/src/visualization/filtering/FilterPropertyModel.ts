import { Property } from '../../shared/entities';
import { FilterModelEntry } from '../../shared/filter';

export default interface FilterPropertyModel extends FilterModelEntry {
  selectedValues: Property[] | null;
}
