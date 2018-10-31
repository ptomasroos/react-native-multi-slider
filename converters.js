// @flow

// Find closest index for a given value
const closest = (array: Array<number>, n: number): number => {
  let minI = 0;
  let maxI = array.length - 1;

  if (array[minI] > n) {
    return minI;
  } else if (array[maxI] < n) {
    return maxI;
  } else if (array[minI] <= n && n <= array[maxI]) {
    let closestIndex = null;

    while (closestIndex === null) {
      const midI = Math.round((minI + maxI) / 2);
      const midVal = array[midI];

      if (midVal === n) {
        closestIndex = midI;
      } else if (maxI === minI + 1) {
        const minValue = array[minI];
        const maxValue = array[maxI];
        const deltaMin = Math.abs(minValue - n);
        const deltaMax = Math.abs(maxValue - n);

        closestIndex = deltaMax <= deltaMin ? maxI : minI;
      } else if (midVal < n) {
        minI = midI;
      } else if (midVal > n) {
        maxI = midI;
      } else {
        closestIndex = -1;
      }
    }

    return closestIndex;
  }

  return -1;
};

export function valueToPosition(
  value: number,
  valuesArray: Array<number>,
  sliderLength: number,
) {
  const index = closest(valuesArray, value);

  const arrLength = valuesArray.length - 1;
  const validIndex = index === -1 ? arrLength : index;

  return (sliderLength * validIndex) / arrLength;
}

export function positionToValue(
  position: number,
  valuesArray: Array<number>,
  sliderLength: number,
): number {
  if (position < 0 || sliderLength < position) {
    return -1;
  }

  const arrLength = valuesArray.length - 1;
  const index = (arrLength * position) / sliderLength;
  return valuesArray[Math.round(index)];
}

export function createArray(
  start: number,
  end: number,
  step: number,
): Array<number> {
  const result: Array<number> = [];

  if (!step) {
    return result;
  }

  const direction = start - end > 0 ? -1 : 1;
  const length = Math.abs((start - end) / step) + 1;

  for (let i = 0; i < length; i++) {
    result.push(start + i * Math.abs(step) * direction);
  }

  return result;
}
