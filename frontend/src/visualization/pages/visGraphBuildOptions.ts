import { Options as VisOptions } from 'vis-network';

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
 * @param layout Possible values: "hierarchical", undefined
 * @returns The react-graph-vis options.
 */
export default function visGraphBuildOptions(
  width: number,
  height: number,
  layout?: string
): VisOptions {
  return {
    layout: {
      hierarchical: layout === 'hierarchical',
    },
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}
