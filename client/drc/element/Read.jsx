import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Read.css";

export default function Read() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/movies/${id}`).then(res => {
      setMovie(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      alert("Failed to load movie");
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="read-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="read-container">
        <div className="error-state">
          <div className="error-icon">😕</div>
          <h2>Movie not found</h2>
          <Link to="/">
            <button className="btn-primary">← Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="read-container">
      <div className="read-card">
        <div className="movie-detail-header">
          <Link to="/">
            <button className="btn-back">← Back</button>
          </Link>
          <Link to={`/edit/${id}`}>
            <button className="btn-edit-link">✏️ Edit</button>
          </Link>
        </div>

        <div className="movie-detail-content">
          <div className="movie-detail-image">
            {movie.image ? (
              <img src={movie.image} alt={movie.name} />
            ) : (
              <div className="movie-image-placeholder-large">🎬</div>
            )}
          </div>

          <div className="movie-detail-info">
            <h1 className="movie-detail-name">{movie.name}</h1>
            
            {movie.rating && (
              <div className="movie-detail-rating">
                <span className="rating-label">Rating</span>
                <div className="rating-value">
                  <span className="star-large">⭐</span>
                  <span className="rating-number">{movie.rating}</span>
                  <span className="rating-max">/10</span>
                </div>
              </div>
            )}

            {movie.created_at && (
              <div className="movie-detail-date">
                <span className="date-label">Added:</span>
                <span className="date-value">
                  {new Date(movie.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}