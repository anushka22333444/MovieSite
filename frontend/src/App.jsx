// src/App.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate();

  const searchMovies = async (searchQuery, currentPage = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/movies/search`, {
        params: {
          q: searchQuery,
          page: currentPage,
        },
      });

      setMovies(response.data.movies || []);
      setTotalResults(response.data.totalResults || 0);
      setPage(currentPage);
    } catch (err) {
      setError("Unable to load movies. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMovies("batman");
  }, []);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "title") {
      return a.Title.localeCompare(b.Title);
    }

    if (sortBy === "newest") {
      return Number(b.Year) - Number(a.Year);
    }

    if (sortBy === "oldest") {
      return Number(a.Year) - Number(b.Year);
    }

    return 0;
  });

  const handleCategorySearch = (category) => {
    setQuery(category);
    setSortBy("default");
    searchMovies(category, 1);
  };

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          Movie Discovery
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-button">
            Home
          </Link>

          <Link to="/wishlist" className="nav-button">
            Wishlist
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="hero-label">MOVIE EXPLORER</p>

          <h1>Find your next favorite movie</h1>

          <p className="hero-description">
            Search movies, explore popular categories, and save titles for
            later.
          </p>

          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              searchMovies(query, 1);
            }}
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <div className="category-list">
            {[
              "Batman",
              "Marvel",
              "Harry Potter",
              "Avengers",
              "Star Wars",
            ].map((category) => (
              <button
                key={category}
                type="button"
                className="category-button"
                onClick={() => handleCategorySearch(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="movies-section">
          <div className="section-heading">
            <div>
              <p className="section-label">DISCOVER</p>
              <h2>Movies</h2>
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="title">Title A–Z</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {loading && <p className="status-message">Loading movies...</p>}

          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && sortedMovies.length === 0 && (
            <p className="status-message">No movies found.</p>
          )}

          <div className="movie-grid">
            {sortedMovies.map((movie) => (
              <article
                className="movie-card"
                key={movie.imdbID}
                onClick={() => navigate(`/movie/${movie.imdbID}`)}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://placehold.co/300x450?text=No+Poster"
                  }
                  alt={movie.Title}
                />

                <div className="movie-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                </div>
              </article>
            ))}
          </div>

          {totalResults > 10 && (
            <div className="pagination">
              <button
                disabled={page === 1 || loading}
                onClick={() => searchMovies(query || "batman", page - 1)}
              >
                Previous
              </button>

              <span>Page {page}</span>

              <button
                disabled={page * 10 >= totalResults || loading}
                onClick={() => searchMovies(query || "batman", page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Wishlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${API_URL}/wishlist`);

        setMovies(response.data.movies || response.data.wishlist || []);
      } catch (err) {
        setError("Unable to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (imdbId) => {
    try {
      await axios.delete(`${API_URL}/wishlist/${imdbId}`);

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.imdbId !== imdbId)
      );
    } catch (err) {
      setError("Unable to remove movie.");
    }
  };

  return (
    <main className="wishlist-page">
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>

      <div className="section-heading">
        <div>
          <p className="section-label">YOUR COLLECTION</p>
          <h1>Your Wishlist</h1>
        </div>
      </div>

      {loading && <p className="status-message">Loading wishlist...</p>}

      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="status-message">
          Your wishlist is empty. Add movies you want to watch.
        </p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <article className="movie-card" key={movie.imdbId}>
            <Link to={`/movie/${movie.imdbId}`}>
              <img
                src={
                  movie.poster !== "N/A"
                    ? movie.poster
                    : "https://placehold.co/300x450?text=No+Poster"
                }
                alt={movie.title}
              />
            </Link>

            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>

              <button
                className="remove-button"
                onClick={() => removeFromWishlist(movie.imdbId)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:imdbId" element={<MovieDetails />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;