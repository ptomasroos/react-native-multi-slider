export function valueToPosition(value, valuesArray, sliderLength) {
  const index = valuesArray.indexOf(value);

  if (index === -1) {
    console.error('Invalid value, array does not contain: ', value);
    return null;
  }

  const arrLength = valuesArray.length - 1;
  return (sliderLength * index) / arrLength;
}

export function positionToValue(position, valuesArray, sliderLength) {
  if (position < 0 || sliderLength < position) {
    console.error('invalid position: ', position);
    return null;
  }
  const arrLength = valuesArray.length - 1;
  const index = (arrLength * position) / sliderLength;
  return valuesArray[Math.round(index)];
}

export function createArray(start, end, step) {
  const direction = start - end > 0 ? -1 : 1;
  const result = [];
  if (!step) {
    console.error('invalid step: ', step);
    return result;
  }

  const length = Math.abs((start - end) / step) + 1;
  for (let i = 0; i < length; i += 1) {
    result.push(start + (i * (Math.abs(step) * direction)));
  }
  return result;
}
