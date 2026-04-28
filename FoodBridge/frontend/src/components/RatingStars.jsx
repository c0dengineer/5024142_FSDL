import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/FoodCard.css';

const RatingStars = ({ initialScore = 0, onChange, readOnly = false }) => {
  const [score, setScore] = useState(initialScore);
  const [hoverScore, setHoverScore] = useState(0);

  const handleStarClick = (index) => {
    if (!readOnly) {
      const newScore = index + 1;
      setScore(newScore);
      if (onChange) {
        onChange(newScore);
      }
    }
  };

  const handleStarHover = (index) => {
    if (!readOnly) {
      setHoverScore(index + 1);
    }
  };

  const displayScore = hoverScore || score;

  return (
    <div className="rating-stars">
      {[0, 1, 2, 3, 4].map((index) => (
        <button
          key={index}
          className={`star-btn ${
            index < displayScore ? 'filled' : 'empty'
          } ${readOnly ? 'read-only' : ''}`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={() => setHoverScore(0)}
          disabled={readOnly}
        >
          <FaStar size={24} />
        </button>
      ))}
      <span className="score-display ml-2">{displayScore}/5</span>
    </div>
  );
};

export default RatingStars;
