/**
 * Return the range of integers from zero to the specified number.
 * @param end The exclusive end of the range.
 * @return An array that contains the sequence of numbers ranging from zero to the specified exclusive end exclusively.
 */
export function range(end: number): number[];

/**
 * Return the range of integers from a specified start to a specified end.
 * @param start The inclusive start of the range.
 * @param end The exclusive end of the range.
 * @return An array that contains the sequence of numbers ranging from the specified start to the specified end exclusively.
 */
export function range(start: number, end: number): number[];

export function range(startOrEnd: number, end?: number): number[] {
  const start = end === undefined ? 0 : startOrEnd;
  const resolvedEnd = end === undefined ? startOrEnd : end;

  const length = resolvedEnd - start;

  return [...Array(length).keys()].map((p) => p + start);
}
