import { useEffect, useState } from "react";
import NavBar from "./components/NavBar.js";
import Logo from "./components/Logo.js";
import Search from "./components/Search.js";
import NumResult from "./components/NumResult.js";
import Main from "./components/Main.js";
import Box from "./components/Box.js";
import Loader from "./components/Loader.js";
import ErrorLoader from "./components/ErrorLoader.js";
import MovieList from "./components/MovieList.js";
import SelectedMovieDetails from "./components/SelectedMovieDetails.js";
import WatchedSummary from "./components/WatchedSummary.js";
import WatchedMovieList from "./components/WatchedMovieList.js";
import { useMovies } from "./components/useMovies.js";
import { useLocalStorageState } from "./components/useLocalStorageState.js";

// Search API to list the movie
// Get valid API to get movie detail after searching

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched");
  // Loading indicator
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  // STEP 1
  // fetch(`http://www.omdbapi.com/?apikey=${key}&`);

  // STEP 2
  // When state is set, the function will also be re-render -> Infinite loop.
  // fetch(`http://www.omdbapi.com/?apikey=${key}&s=marvel`)
  //   .then((respond) => respond.json())
  //   .then((data) => setMovies(data.Search));

  // STEP 3
  // Use useEffect
  // BEFORE: func run while the component renders(inside render logic)
  // AFTER: Register an effect(function) contain that func run after the component render(outside render logic)
  // => Control when to run the function
  // Dependency array: []: will only run on mount/when render 1st time

  // STEP 4
  // Tranfer promises function .then() to async await
  // But async func return a promise value (useEffect doesn't return value)
  // => Wrap promise func inside an arrow func
  function handleSelectMovie(selectId) {
    setSelectedId(selectId !== selectedId ? selectId : null);
  }

  function handleCLoseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorLoader errorMessage={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCLoseMovie}
              onAddWatchMovie={handleAddWatchMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
