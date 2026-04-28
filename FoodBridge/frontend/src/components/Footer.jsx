import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import '../styles/Navbar.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom">
      <Container>
        <Row className="py-5">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading">🍱 FoodBridge</h5>
            <p className="footer-text">
              Connecting food donors with those in need. Fighting hunger and reducing waste.
            </p>
            <div className="sdg-badges">
              <span className="badge-sdg">SDG 2: Zero Hunger</span>
              <span className="badge-sdg">SDG 12: Responsible Consumption</span>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/food">Browse Food</a></li>
              <li><a href="/leaderboard">Leaderboard</a></li>
              <li><a href="https://github.com/foodbridge">GitHub</a></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="footer-heading">Follow Us</h5>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </Col>
        </Row>

        <Row className="border-top pt-4">
          <Col md={6} className="text-center text-md-start">
            <p className="footer-text mb-0">
              © {currentYear} FoodBridge. Made for SDG 2 & 12.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="footer-text mb-0">
              Made with <FaHeart className="text-danger" /> by the FoodBridge Team
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
