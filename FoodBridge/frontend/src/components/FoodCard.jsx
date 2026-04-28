import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';
import { formatDateShort } from '../utils/formatDate';
import '../styles/FoodCard.css';

const FoodCard = ({ food }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      cooked: '🍜',
      raw: '🥦',
      packaged: '📦',
      beverage: '🥤',
      other: '🍱',
    };
    return icons[category] || '🍱';
  };

  const getDietaryIcon = (tag) => {
    const icons = {
      veg: '🥬',
      'non-veg': '🍗',
      'gluten-free': '🌾',
      vegan: '🌱',
      'dairy-free': '🥛',
      'nut-free': '🥜',
    };
    return icons[tag] || '✓';
  };

  return (
    <Card className="food-card">
      <Card.Body className="card-body-custom">
        <div className="card-header-section">
          <div className="category-badge">
            {getCategoryIcon(food.category)} {food.category}
          </div>
          <Badge className={`status-badge status-${food.status}`}>
            {food.status}
          </Badge>
        </div>

        <Card.Title className="food-title">{food.title}</Card.Title>

        <div className="quantity-info">
          📊 {food.quantity} {food.quantityUnit}
        </div>

        <div className="dietary-tags">
          {food.tags.map((tag) => (
            <span key={tag} className="dietary-tag">
              {getDietaryIcon(tag)} {tag}
            </span>
          ))}
        </div>

        <div className="location-info">
          📍 {food.city}
        </div>

        <CountdownTimer expiresAt={food.expiresAt} />

        <div className="donor-info">
          <img
            src={food.donor?.avatar}
            alt={food.donor?.name}
            className="donor-avatar"
          />
          <div className="donor-details">
            <h6>{food.donor?.name}</h6>
            <div className="rating">
              ⭐ {food.donor?.averageRating || 0} ({food.donor?.ratingCount || 0})
            </div>
          </div>
        </div>

        <Link to={`/food/${food._id}`} className="btn btn-view-details">
          View Details
        </Link>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
