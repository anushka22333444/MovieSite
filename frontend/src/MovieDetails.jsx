// frontend/src/MovieDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function MovieDetails() {
  const { imdbId } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/movies/${imdbId}`);
        setMovie(response.data.movie);
      } catch (err) {
        console.error("Movie details error:", err.response?.data || err.message);
        setError("Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbId]);

  const addToWishlist = async () => {
    if (!movie) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/wishlist`, {
        imdbId: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      });

      setMessage(response.data.message || "Movie added to wishlist.");
    } catch (err) {
      console.error("Wishlist error:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        setMessage("Movie is already in your wishlist.");
      } else {
        setMessage(
          err.response?.data?.message ||
            "Unable to add movie to wishlist. Check the backend."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading movie details...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!movie) {
    return <p className="status-message">Movie not found.</p>;
  }

  return (
    <main className="details-page">
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>

      <section className="details-card">
        <img
          className="details-poster"
          src={
            movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "https://placehold.co/400x600?text=No+Poster"
          }
          alt={movie.Title}
        />

        <div className="details-content">
          <p className="details-type">
            {movie.Type} · {movie.Year}
          </p>

          <h1>{movie.Title}</h1>

          <p className="details-meta">
            ⭐ {movie.imdbRating} · {movie.Runtime} · {movie.Genre}
          </p>

          <p className="details-plot">{movie.Plot}</p>

          <div className="details-info">
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>

            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>

            <p>
              <strong>Language:</strong> {movie.Language}
            </p>

            <p>
              <strong>Country:</strong> {movie.Country}
            </p>
          </div>

          <button
            className="wishlist-button"
            onClick={addToWishlist}
            disabled={saving}
          >
            {saving ? "Adding..." : "＋ Add to Wishlist"}
          </button>

          {message && <p className="wishlist-message">{message}</p>}
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;