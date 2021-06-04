import { green } from '@material-ui/core/colors';
import { Node } from '../../shared/entities';
import SimpleStore from '../SimpleStore';
import EntityVisualisationAttributes from './EntityVisualisationAttributes';

type NodeTypes = Node['types'];

type StoreType = (type: NodeTypes) => EntityVisualisationAttributes;

export default class NodeColorStore extends SimpleStore<StoreType> {
  protected getInitialValue(): StoreType {
    // TODO real implementation
    return () => ({ color: green[500] });
  }
}
