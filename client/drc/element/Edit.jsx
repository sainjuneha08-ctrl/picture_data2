import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Edit.css";

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/movies/${id}`).then(res => {
      const m = res.data;
      setName(m.name);
      setRating(m.rating || "");
      setCurrentImage(m.image);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      alert("Failed to load movie");
      setLoading(false);
    });
  }, [id]);

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!name.trim()) {
      alert("Please enter a movie name");
      return;
    }
    try {
      const body = { name, rating };
      if (preview) body.image = preview;

      await axios.put(`/movies/${id}`, body);
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update movie");
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>✏️ Edit Movie</h1>
          <p>Update the movie information</p>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label htmlFor="name">Movie Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter movie name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (out of 10)</label>
            <input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={e => setRating(e.target.value)}
              placeholder="e.g., 8.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Movie Poster</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={onFile}
              className="file-input"
            />
            {(preview || currentImage) && (
              <div className="image-preview">
                <img
                  src={preview || currentImage}
                  alt="Movie preview"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button onClick={save} className="btn-save">
              💾 Save Changes
            </button>
            <Link to="/">
              <button className="btn-cancel">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}