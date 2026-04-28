import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../styles/global.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <Spinner animation="border" role="status" className="loader-spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;
