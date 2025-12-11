import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await axios.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load movies");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axios.delete(`/movies/${id}`);
      setMovies(movies.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">🎬 neha Movies Collection</h1>
        <p className="home-subtitle">Your personal movie database</p>
        <Link to="/create">
          <button className="btn-primary">+ Add New Movie</button>
        </Link>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <h2>No movies yet</h2>
          <p>Start building your collection by adding your first movie!</p>
          <Link to="/create">
            <button className="btn-primary">Add Your First Movie</button>
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map(m => (
            <div key={m.id} className="movie-card">
              <div className="movie-image-container">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="movie-image"
                  />
                ) : (
                  <div className="movie-image-placeholder">🎬</div>
                )}
                <div className="movie-overlay">
                  <Link to={`/read/${m.id}`}>
                    <button className="btn-icon">👁️ View</button>
                  </Link>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-name">{m.name}</h3>
                {m.rating && (
                  <div className="movie-rating">
                    <span className="star">⭐</span>
                    <span>{m.rating}/10</span>
                  </div>
                )}
                <div className="movie-actions">
                  <Link to={`/edit/${m.id}`}>
                    <button className="btn-edit">✏️ Edit</button>
                  </Link>
                  <button 
                    className="btn-delete" 
                    onClick={() => remove(m.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}