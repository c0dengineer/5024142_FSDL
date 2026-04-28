import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/Dashboard.css';

const StatCard = ({ icon, label, value, color = 'primary', trend = null }) => {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <Card.Body>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <h6 className="stat-label">{label}</h6>
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <small className={`trend ${trend.positive ? 'positive' : 'negative'}`}>
              {trend.positive ? '📈' : '📉'} {trend.text}
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
