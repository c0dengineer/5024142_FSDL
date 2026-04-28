import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentFoods, setRecentFoods] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, foodRes, leaderRes] = await Promise.all([
          api.get('/stats/global'),
          api.get('/food?limit=3&sort=newest'),
          api.get('/stats/leaderboard?period=month'),
        ]);

        setStats(statsRes.data.data);
        setRecentFoods(foodRes.data.data);
        setLeaderboard(leaderRes.data.data.topDonors.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Don't Waste Food. <span className="highlight">Share It.</span>
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                FoodBridge connects food donors with those in need, helping to reduce waste and fight hunger while supporting UN Sustainable Development Goals 2 & 12.
              </motion.p>
              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {isAuthenticated ? (
                  <>
                    {user?.role === 'donor' && (
                      <Link to="/add-food" className="btn btn-primary btn-lg">
                        📝 Donate Food
                      </Link>
                    )}
                    {user?.role === 'receiver' && (
                      <Link to="/food" className="btn btn-primary btn-lg">
                        🔍 Find Food
                      </Link>
                    )}
                    <Link to="/dashboard" className="btn btn-outline-primary btn-lg">
                      📊 Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      🚀 Get Started
                    </Link>
                    <Link to="/food" className="btn btn-outline-primary btn-lg">
                      🔍 Browse Food
                    </Link>
                  </>
                )}
              </motion.div>
            </Col>

            <Col lg={6} className="hero-illustration">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="illustration-emoji">🍱</div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="stats-section py-5">
          <Container>
            <h2 className="section-title">Platform Impact</h2>
            <Row>
              <Col md={3} sm={6} className="mb-4">
                <StatCard
                  icon="🍱"
                  label="Food Donated"
                  value={`${stats.totalQuantityDonated} kg`}
                  color="success"
                />
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <StatCard
                  icon="🍽️"
                  label="Meals Saved"
                  value={stats.estimatedMealsSaved.toLocaleString()}
                  color="info"
                />
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <StatCard
                  icon="👥"
                  label="Total Donors"
                  value={stats.totalDonors}
                  color="warning"
                />
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <StatCard
                  icon="♻️"
                  label="CO₂ Saved"
                  value={`${stats.co2SavedKg} kg`}
                  color="danger"
                />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* How It Works */}
      <section className="how-it-works py-5">
        <Container>
          <h2 className="section-title">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4">
              <motion.div
                className="step-card"
                whileHover={{ translateY: -10 }}
              >
                <div className="step-number">1️⃣</div>
                <h4>Post Your Food</h4>
                <p>Donors list available food with details and expiry time</p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                className="step-card"
                whileHover={{ translateY: -10 }}
              >
                <div className="step-number">2️⃣</div>
                <h4>Request & Accept</h4>
                <p>Receivers request food, donors approve requests</p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                className="step-card"
                whileHover={{ translateY: -10 }}
              >
                <div className="step-number">3️⃣</div>
                <h4>Pickup & Share</h4>
                <p>Arrange pickup and complete the transaction with ratings</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recent Foods */}
      <section className="recent-foods py-5">
        <Container>
          <h2 className="section-title">Recently Listed Food</h2>
          <Row>
            {recentFoods.map((food) => (
              <Col md={4} key={food._id} className="mb-4">
                <FoodCard food={food} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/food" className="btn btn-primary btn-lg">
              🔍 View All Food
            </Link>
          </div>
        </Container>
      </section>

      {/* Leaderboard Preview */}
      <section className="leaderboard-preview py-5">
        <Container>
          <h2 className="section-title">Top Donors This Month</h2>
          <Row>
            {leaderboard.map((donor, index) => (
              <Col md={4} key={donor.userId} className="mb-4">
                <motion.div
                  className={`leaderboard-card rank-${index + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="rank-badge">
                    {['🥇', '🥈', '🥉'][index] || `#${index + 1}`}
                  </div>
                  <img src={donor.avatar} alt={donor.name} />
                  <h5>{donor.name}</h5>
                  <p className="city">{donor.city}</p>
                  <div className="donor-stats">
                    <span>{donor.totalQuantityDonated} kg donated</span>
                    <span>⭐ {donor.averageRating}</span>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/leaderboard" className="btn btn-outline-primary btn-lg">
              View Full Leaderboard
            </Link>
          </div>
        </Container>
      </section>

      {/* SDG Section */}
      <section className="sdg-section py-5">
        <Container>
          <h2 className="section-title">Supporting UN Sustainable Development Goals</h2>
          <Row>
            <Col md={6} className="mb-4">
              <div className="sdg-card">
                <h4>🎯 SDG 2: Zero Hunger</h4>
                <p>Helping to end hunger by connecting surplus food with those in need</p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="sdg-card">
                <h4>♻️ SDG 12: Responsible Consumption</h4>
                <p>Reducing food waste and promoting sustainable consumption patterns</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
