import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
  // Input: initial value(DOM element usually null)
  const inputEl = useRef(null);

  // ref={inputEl} only gets added to DOM element <input> after the DOM loaded
  // => Can only access it inside useEffect
  useEffect(() => {
    // inputEl.current = document.querySelector(".search")
    inputEl.current.focus();
    console.log(inputEl.current);
  }, []);

  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   const el = document.getElementsByClassName("search")[0];
  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      // Connect <input> tag with useRef
      ref={inputEl}
    />
  );
}
