import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { FaBars, FaTimes, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from './NotificationBell';
import '../styles/Navbar.css';

const NavbarComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text">
          🍱 FoodBridge
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleNavClick}
              className="nav-link-custom"
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/food"
              onClick={handleNavClick}
              className="nav-link-custom"
            >
              Browse Food
            </Nav.Link>

            {isAuthenticated && user?.role === 'donor' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/add-food"
                  onClick={handleNavClick}
                  className="nav-link-custom"
                >
                  Donate
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/my-listings"
                  onClick={handleNavClick}
                  className="nav-link-custom"
                >
                  My Listings
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/requests-received"
                  onClick={handleNavClick}
                  className="nav-link-custom"
                >
                  Requests
                </Nav.Link>
              </>
            )}

            {isAuthenticated && user?.role === 'receiver' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/my-requests"
                  onClick={handleNavClick}
                  className="nav-link-custom"
                >
                  My Requests
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={Link}
              to="/leaderboard"
              onClick={handleNavClick}
              className="nav-link-custom"
            >
              Leaderboard
            </Nav.Link>

            {isAuthenticated && (
              <>
                <div className="notification-bell-wrapper">
                  <NotificationBell />
                </div>

                <Dropdown className="user-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    className="user-dropdown-toggle"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="avatar-small"
                    />
                    <span className="ms-2">{user?.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className="dropdown-menu-custom">
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      onClick={handleNavClick}
                    >
                      <FaUser className="me-2" />
                      Profile
                    </Dropdown.Item>

                    <Dropdown.Item
                      as={Link}
                      to="/dashboard"
                      onClick={handleNavClick}
                    >
                      📊 Dashboard
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={handleNavClick}
                  className="nav-link-custom"
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={handleNavClick}
                  className="nav-link-btn"
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
