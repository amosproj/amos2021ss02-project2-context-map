function getRandomInteger(max: number): number;
function getRandomInteger(min: number, max: number): number;
function getRandomInteger(minOrMax: number, max?: number): number {
  let resolvedMin: number;
  let resolvedMax: number;

  if (max !== undefined) {
    resolvedMin = minOrMax;
    resolvedMax = max;
  } else {
    resolvedMin = 0;
    resolvedMax = minOrMax;
  }

  return Math.floor(Math.random() * (resolvedMax - resolvedMin) + resolvedMin);
}

export default getRandomInteger;
