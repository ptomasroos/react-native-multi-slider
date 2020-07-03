// Find closest index for a given value
const closest = (array, n) => {
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
  value,
  valuesArray,
  sliderLength,
  markerSize = 0,
) {
  if (value === undefined) return undefined;
  const index = closest(valuesArray, value);
  const arrLength = valuesArray.length - 1;
  const validIndex = index === -1 ? arrLength : index;
  const output =
    ((sliderLength - markerSize) * validIndex) / arrLength + markerSize / 2;

  return output;
}

export function positionToValue(
  position,
  valuesArray,
  sliderLength,
  markerSize = 0,
) {
  if (position < 0 || sliderLength < position) {
    return null;
  } else {
    const arrLength = valuesArray.length - 1;
    const offset = (position - markerSize / 2) / (sliderLength - markerSize);
    const index =
      (arrLength * (position - markerSize / 2 + offset * markerSize)) /
      sliderLength;
    const output = valuesArray[Math.round(index)];

    return output;
  }
}

export function createArray(start, end, step) {
  const direction = start - end > 0 ? -1 : 1;
  const result = [];
  if (!step) {
    return result;
  } else {
    const length = Math.abs((start - end) / step) + 1;
    for (let i = 0; i < length; i++) {
      result.push(start + i * Math.abs(step) * direction);
    }
    return result;
  }
}
