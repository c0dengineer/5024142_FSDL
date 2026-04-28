import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const FoodDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFoodDetail();
  }, [id]);

  const fetchFoodDetail = async () => {
    try {
      const response = await api.get(`/food/${id}`);
      setFood(response.data.data);
    } catch (error) {
      console.error('Error fetching food detail:', error);
      toast.error('Food not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    setSubmitting(true);
    try {
      await api.post('/requests', {
        foodId: id,
        message: requestMessage,
      });
      toast.success('Request sent to donor!');
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!food) return <div>Food not found</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h2>{food.title}</h2>
              <CountdownTimer expiresAt={food.expiresAt} />

              <div className="my-4">
                <h5>Description</h5>
                <p>{food.description}</p>
              </div>

              <div className="my-4">
                <h5>Details</h5>
                <ul>
                  <li><strong>Category:</strong> {food.category}</li>
                  <li><strong>Quantity:</strong> {food.quantity} {food.quantityUnit}</li>
                  <li><strong>City:</strong> {food.city}</li>
                  <li><strong>Views:</strong> {food.views}</li>
                  {food.tags.length > 0 && <li><strong>Tags:</strong> {food.tags.join(', ')}</li>}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5>Donor Information</h5>
              <div className="text-center mb-3">
                <img
                  src={food.donor?.avatar}
                  alt={food.donor?.name}
                  style={{ width: '80px', borderRadius: '50%' }}
                />
              </div>
              <h6>{food.donor?.name}</h6>
              <p className="text-muted">{food.donor?.city}</p>
              <p>⭐ {food.donor?.averageRating} ({food.donor?.ratingCount} reviews)</p>
              <p>📞 {food.donor?.phone || 'Not provided'}</p>

              {user?.role === 'receiver' && food.status === 'available' && (
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => setShowRequestModal(true)}
                >
                  Request This Food
                </Button>
              )}

              {food.status !== 'available' && (
                <Button variant="secondary" className="w-100" disabled>
                  {food.status === 'claimed' ? '✅ Claimed' : '❌ Not Available'}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Request Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Message (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Add a message to the donor..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRequest}
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FoodDetail;
