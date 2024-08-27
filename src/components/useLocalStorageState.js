import { useState, useEffect } from "react";

// BEFORE
// const [watched, setWatched] = useState(() => {
//   const storedValue = JSON.parse(localStorage.getItem("watched"));
//   return storedValue;
// });
// useEffect(() => {
//   localStorage.setItem("watched", JSON.stringify(watched));
// }, [watched]);

/*
// AFTER 1
// set state and read the state(1) from localStorage
// Update the state(1) and set back to localStorage
// INPUT: initialState: value to set when data not exist
//        key: key name that hold the state data
// OUTPUT: value: state that access the local storage as initial value
//         setValue: update state and also update localStorage
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // When item 'key' is not found, storedValue = null => JSON.parse(storedValue) = error
    // Check if data inside key is valid or not
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
*/

// AFTER 2: Separate details
export function useLocalStorageState(initialState, key) {
  const storedValue = localStorage.getItem(key);
  const stateValue = storedValue ? JSON.parse(storedValue) : initialState;
  const [value, setValue] = useState(stateValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
