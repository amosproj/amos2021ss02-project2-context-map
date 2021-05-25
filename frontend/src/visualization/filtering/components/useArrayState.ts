import React, { useState } from 'react';

function useArrayState<T>(
  initial: T[]
): [T[], React.Dispatch<React.SetStateAction<T>>[]] {
  const values: T[] = [];
  const setValues: React.Dispatch<React.SetStateAction<T>>[] = [];

  const size = initial.length;

  for (let i = 0; i < size; i += 1) {
    const initValue = initial[i];
    const [value, setValue] = useState<T>(initValue);

    values.push(value);
    setValues.push(setValue);
  }

  return [values, setValues];
}

export default useArrayState;
