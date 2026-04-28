import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/stats/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  if (!stats) return <div>Error loading dashboard</div>;

  const chartData = stats.donationsByDay
    ? Object.entries(stats.donationsByDay).map(([date, qty]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        quantity: qty,
      }))
    : [];

  return (
    <Container className="dashboard-container py-5">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="text-muted">
              {stats.role === 'donor'
                ? 'Here's your donation activity'
                : 'Here's your request activity'}
            </p>
          </div>
        </Col>
      </Row>

      {/* Stats Grid */}
      <Row className="mb-5">
        {stats.role === 'donor' ? (
          <>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="🥘"
                label="Total Donated"
                value={`${stats.totalDonations} kg`}
                color="success"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="📋"
                label="Active Listings"
                value={stats.activeListings}
                color="info"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="⏳"
                label="Pending Requests"
                value={stats.pendingRequests}
                color="warning"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="✅"
                label="Completed"
                value={stats.completedRequests}
                color="primary"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="⭐"
                label="Average Rating"
                value={stats.averageRating.toFixed(1)}
                color="warning"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="🍽️"
                label="People Fed"
                value={stats.peopleFed}
                color="success"
              />
            </Col>
          </>
        ) : (
          <>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="📮"
                label="Total Requests"
                value={stats.totalRequests}
                color="info"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="✅"
                label="Accepted"
                value={stats.acceptedRequests}
                color="success"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="🎉"
                label="Completed"
                value={stats.completedRequests}
                color="primary"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="❌"
                label="Rejected"
                value={stats.rejectedRequests}
                color="danger"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <StatCard
                icon="🥘"
                label="Food Received"
                value={`${stats.totalReceived} kg`}
                color="success"
              />
            </Col>
          </>
        )}
      </Row>

      {/* Charts and Details */}
      {stats.role === 'donor' && stats.donationsByDay && (
        <Row className="mb-5">
          <Col>
            <Card className="chart-card">
              <Card.Body>
                <Card.Title>Donations Last 30 Days</Card.Title>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#2ECC71" name="Quantity (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {stats.role === 'receiver' && stats.nearbyFood && (
        <Row>
          <Col>
            <Card className="nearby-card">
              <Card.Body>
                <Card.Title>🔍 Nearby Available Food</Card.Title>
                {stats.nearbyFood.length > 0 ? (
                  <div className="nearby-grid">
                    {stats.nearbyFood.map((food) => (
                      <div key={food._id} className="nearby-item">
                        <h6>{food.title}</h6>
                        <p>{food.quantity} {food.quantityUnit}</p>
                        <small>by {food.donor?.name}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No nearby food available</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
