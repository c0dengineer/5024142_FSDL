import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import api from '../api/axios';
import Loader from '../components/Loader';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/stats/leaderboard?period=${period}`);
      setLeaderboard(response.data.data.topDonors);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Container className="py-5">
      <h2 className="mb-4">🏆 Top Donors</h2>

      <div className="mb-4">
        <Button
          variant={period === 'week' ? 'primary' : 'outline-primary'}
          onClick={() => setPeriod('week')}
          className="me-2"
        >
          This Week
        </Button>
        <Button
          variant={period === 'month' ? 'primary' : 'outline-primary'}
          onClick={() => setPeriod('month')}
          className="me-2"
        >
          This Month
        </Button>
        <Button
          variant={period === 'all-time' ? 'primary' : 'outline-primary'}
          onClick={() => setPeriod('all-time')}
        >
          All Time
        </Button>
      </div>

      <Row>
        {leaderboard.map((donor, index) => (
          <Col md={6} lg={4} key={donor.userId} className="mb-4">
            <Card className={`leaderboard-card ${index < 3 ? 'top-3' : ''}`}>
              <Card.Body className="text-center">
                {index < 3 && <div className="medal-badge">{medals[index]}</div>}
                <div className="rank-number">#{index + 1}</div>
                <img
                  src={donor.avatar}
                  alt={donor.name}
                  style={{ width: '80px', borderRadius: '50%', marginY: '10px' }}
                />
                <h5 className="mt-3">{donor.name}</h5>
                <p className="text-muted">{donor.city}</p>

                <div className="donor-stats">
                  <div className="stat-item">
                    <span className="stat-value">{donor.totalQuantityDonated}</span>
                    <span className="stat-label">kg Donated</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{donor.totalListings}</span>
                    <span className="stat-label">Listings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">⭐ {donor.averageRating.toFixed(1)}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Leaderboard;
