export interface HasId {
  id: number;
}

function compareById<T extends HasId>(a: T, b: T) {
  return a.id - b.id;
}

export function deduplicateEntities<T extends HasId>(
  nodes: T[],
  maintainOrder = true
): T[] {
  if (maintainOrder) {
    const seen: boolean[] = [];
    const result = nodes;
    for (let i = result.length - 1; i >= 0; i -= 1) {
      if (seen[result[i].id]) {
        // Found duplicate
        result.splice(i, 1);
      }
      seen[result[i].id] = true;
    }
    return result;
  }

  const result = nodes.sort(compareById);
  for (let i = result.length - 1; i > 0; i -= 1) {
    if (result[i].id === result[i - 1].id) {
      // Found duplicate
      result.splice(i, 1);
    }
  }
  return result;
}
