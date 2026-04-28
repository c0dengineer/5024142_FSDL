import React, { useState, useEffect } from 'react';
import { getExpiryColor, shouldPulseExpiry } from '../utils/expiryHelper';
import '../styles/FoodCard.css';

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [color, setColor] = useState('success');
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(expiresAt);
      const diff = expiryDate - now;

      if (diff < 0) {
        setTimeLeft('EXPIRED');
        setColor('danger');
        setShouldPulse(false);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }

        setColor(getExpiryColor(expiryDate));
        setShouldPulse(shouldPulseExpiry(expiryDate));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div
      className={`countdown-timer ${shouldPulse ? 'pulse' : ''} bg-${color} text-white`}
    >
      ⏱️ {timeLeft}
    </div>
  );
};

export default CountdownTimer;
