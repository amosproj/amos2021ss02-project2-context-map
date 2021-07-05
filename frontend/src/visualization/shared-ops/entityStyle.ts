import { EdgeStyle, NodeStyle } from '../../stores/colors';

export function nodeStyle(style: NodeStyle): unknown {
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

export function edgeStyle(style: EdgeStyle): unknown {
  return {
    color: style.color,
    dashes: style.stroke.dashes,
    width: style.stroke.width,
  };
}
