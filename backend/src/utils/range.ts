export function range(end: number): number[];
export function range(start: number, end: number): number[];

export function range(startOrEnd: number, end?: number): number[] {
  const start = end === undefined ? 0 : startOrEnd;
  const resolvedEnd = end === undefined ? startOrEnd : end;

  const length = resolvedEnd - start;

  return [...Array(length).keys()].map((p) => p + start);
}
