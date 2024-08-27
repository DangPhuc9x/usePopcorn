import { useEffect } from "react";

// USAGE: similar to useEffect
// Example 1: normal function
// useKey("Escape", handleCLoseMovie);
//
// Example 2: callback function
// const inputEl = useRef(null);
// ...
// useKey("Enter", () => {
//   if (document.activeElement === inputEl.current) return;
//   inputEl.current.focus();
//   ...
// })
// ...
// return (<input ... ref={inputEl} />)

export function useKey(key, action) {
  useEffect(() => {
    function callback(event) {
      if (event.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [key, action]);
}
