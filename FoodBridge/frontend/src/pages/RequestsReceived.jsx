import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests/received');
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await api.patch(`/requests/${requestId}/status`, { status: newStatus });
      toast.success(`Request ${newStatus}!`);
      fetchRequests();
    } catch (error) {
      toast.error('Error updating request');
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-5">
      <h2 className="mb-4">📬 Requests Received</h2>

      {requests.length === 0 ? (
        <p>No requests received</p>
      ) : (
        <Row>
          {requests.map((req) => (
            <Col md={6} lg={4} key={req._id} className="mb-4">
              <Card>
                <Card.Body>
                  <h5>{req.food?.title}</h5>
                  <p><strong>Requester:</strong> {req.receiver?.name}</p>
                  <p><strong>Phone:</strong> {req.receiver?.phone}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <Badge bg={req.status === 'pending' ? 'warning' : 'success'} className="mb-3">{req.status}</Badge>
                  <br />
                  {req.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleStatusUpdate(req._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleStatusUpdate(req._id, 'completed')}
                    >
                      Mark Picked Up
                    </Button>
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

export default RequestsReceived;
