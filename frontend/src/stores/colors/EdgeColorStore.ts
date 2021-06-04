import { purple } from '@material-ui/core/colors';
import { Edge } from '../../shared/entities';
import SimpleStore from '../SimpleStore';
import EntityVisualisationAttributes from './EntityVisualisationAttributes';

type EdgeType = Edge['type'];

type StoreType = (type: EdgeType) => EntityVisualisationAttributes;

export default class EdgeColorStore extends SimpleStore<StoreType> {
  protected getInitialValue(): StoreType {
    // TODO real implementation
    return () => ({ color: purple[500] });
  }
}
