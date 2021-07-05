import { EdgeStyle, NodeStyle } from '../../stores/colors';

type NodeStyleProperties = {
  color: { border: string; background: string };
  borderWidth: number;
  shapeProperties: { borderDashes: boolean | number[] };
};

type EdgeStyleProperties = {
  color: string;
  dashes: boolean | number[];
  width: number;
};

export function nodeStyle(style: NodeStyle): NodeStyleProperties {
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

export function edgeStyle(style: EdgeStyle): EdgeStyleProperties {
  return {
    color: style.color,
    dashes: style.stroke.dashes,
    width: style.stroke.width,
  };
}
