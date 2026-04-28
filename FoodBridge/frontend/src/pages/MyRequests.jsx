import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import api from '../api/axios';
import Loader from '../components/Loader';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests/my');
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-5">
      <h2 className="mb-4">📮 My Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <Row>
          {requests.map((req) => (
            <Col md={6} lg={4} key={req._id} className="mb-4">
              <Card>
                <Card.Body>
                  <h5>{req.food?.title}</h5>
                  <p><strong>Donor:</strong> {req.donor?.name}</p>
                  <p><strong>Status:</strong> <Badge bg={req.status === 'accepted' ? 'success' : req.status === 'pending' ? 'warning' : 'danger'}>{req.status}</Badge></p>
                  <p><strong>Message:</strong> {req.message || 'No message'}</p>
                  {req.status === 'pending' && (
                    <Button variant="danger" size="sm">Cancel Request</Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyRequests;
