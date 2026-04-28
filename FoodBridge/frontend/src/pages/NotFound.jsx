import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '120px', margin: 0 }}>404</h1>
        <h2 className="mb-4">Oops! Page Not Found 😔</h2>
        <p className="mb-4" style={{ fontSize: '18px', maxWidth: '500px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          🏠 Back to Home
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
