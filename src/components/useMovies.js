import { useState, useEffect } from "react";

// Variable doesn't depend on anything inside the component
// Declare outside to prevent re-initialization
const key = "5b02d3f7";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    // To stop HTTP request to run all-in-once(race condition)
    // Next request create, last request will be abort
    const controller = new AbortController();

    async function fetchMovie() {
      try {
        setIsLoading(true);
        // Fix error no result shown when search
        setError("");

        const respond = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );

        const data = await respond.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          // console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
        setError("");
      }
    }

    if (query.length < 2) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovie();

    // Clean up current request
    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
