import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Create.css";

export default function Create() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!name.trim()) {
      alert("Please enter a movie name");
      return;
    }
    
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    
    try {
      // Convert rating to number or null
      const ratingValue = rating && rating.trim() ? parseFloat(rating) : null;
      
      // Validate rating range if provided
      if (ratingValue !== null && (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10)) {
        alert("Rating must be a number between 0 and 10");
        setLoading(false);
        return;
      }
      
      const payload = {
        name: name.trim(),
        rating: ratingValue,
        image: image || null
      };
      
      console.log("Sending payload:", {
        name: payload.name,
        rating: payload.rating,
        imageLength: payload.image ? payload.image.length : 0
      });
      
      const response = await axios.post("/movies", payload, {
        timeout: 30000, // 30 second timeout for large images
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Movie created successfully:", response.data);
      nav("/");
    } catch (err) {
      console.error("Error creating movie:", err);
      console.error("Error response:", err.response);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      let errorMessage = "Failed to create movie";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. The image might be too large.";
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check if the server is running.";
      }
      
      alert(`Failed to create movie: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>➕ Add New Movie</h1>
          <p>Fill in the details to add a movie to your collection</p>
        </div>

        <form className="form-body" onSubmit={submit}>
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
            {image && (
              <div className="image-preview">
                <img src={image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "💾 Saving..." : "💾 Save Movie"}
            </button>
            <Link to="/">
              <button type="button" className="btn-cancel" disabled={loading}>
                ← Back to Home
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}