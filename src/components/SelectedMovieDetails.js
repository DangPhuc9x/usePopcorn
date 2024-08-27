import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating.js";
import ErrorLoader from "./ErrorLoader";
import Loader from "./Loader";

// Variable doesn't depend on anything inside the component
// Declare outside to prevent re-initialization
const key = "5b02d3f7";

export default function SelectedMovieDetails({
  selectedId,
  watched,
  onCloseMovie,
  onAddWatchMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  const isWatched = watched
    .map((watchedMovie) => watchedMovie.imdbID)
    .includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Need countRef to remenber count number through the re-render
  useEffect(() => {
    // Also run on mount => countRef + 2
    // Make sure only count when there is userRating
    if (userRating) {
      console.log("hi there");
      countRef.current = countRef.current + 1;
    }
  }, [userRating]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatchMovie(newWatchedMovie);
  }

  // Action when press key
  useEffect(() => {
    function handleKeyDown(key) {
      if (key.code === "Escape") {
        onCloseMovie();
        console.log("CLOSING");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCloseMovie]);

  // Get movie API
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      try {
        const respond = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );

        const data = await respond.json();
        // console.log(data);

        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `${title}`;

    return () => {
      document.title = "usePopcorn - Manage your movies list";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>Added to list</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorLoader errorMessage={error} />}
    </div>
  );
}
