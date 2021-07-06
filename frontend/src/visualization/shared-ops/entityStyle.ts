import {
  EdgeOptions,
  NodeOptions,
} from 'vis-network/declarations/network/Network';
import { EdgeStyle, NodeStyle } from '../../stores/colors';

export function nodeStyle(style: NodeStyle): NodeOptions {
  return {
    color: {
      border: style.stroke.color,
      background: style.color,
    },
    borderWidth: style.stroke.width,
    shapeProperties: {
      borderDashes: style.stroke.dashes,
    },
  };
}

export function edgeStyle(style: EdgeStyle): EdgeOptions {
  return {
    color: style.color,
    dashes: style.stroke.dashes,
    width: style.stroke.width,
  };
}
