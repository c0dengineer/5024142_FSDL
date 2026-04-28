import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import '../styles/Auth.css';

const AddFood = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    quantityUnit: 'plates',
    category: 'cooked',
    images: [],
    city: '',
    expiresAt: '',
    tags: [],
  });

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  const categories = ['cooked', 'raw', 'packaged', 'beverage', 'other'];
  const tags = ['veg', 'non-veg', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleNext = () => {
    if (!formData.title || !formData.description || !formData.quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.city || !formData.expiresAt) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/food', formData);
      toast.success('Food listed successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-5">
      <div className="add-food-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card>
          <Card.Body>
            <h2 className="mb-4">🍱 List Your Food {step === 1 ? '(Step 1/2)' : '(Step 2/2)'}</h2>
            <div className="progress mb-4">
              <div className="progress-bar" style={{ width: `${(step / 2) * 100}%` }} />
            </div>

            <Form onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Food Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Homemade Biryani"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your food, ingredients, preparation..."
                      rows={4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Quantity *</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Amount"
                      />
                      <Form.Select
                        name="quantityUnit"
                        value={formData.quantityUnit}
                        onChange={handleChange}
                        style={{ maxWidth: '120px' }}
                      >
                        <option>plates</option>
                        <option>kg</option>
                        <option>boxes</option>
                        <option>litres</option>
                        <option>pieces</option>
                      </Form.Select>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Dietary Tags</Form.Label>
                    <div className="tags-grid">
                      {tags.map((tag) => (
                        <Button
                          key={tag}
                          variant={formData.tags.includes(tag) ? 'primary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className="me-2 mb-2"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleNext}
                    className="w-100"
                  >
                    Next Step
                  </Button>
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>
                    <Form.Select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Expiry Date & Time *</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Alert variant="info">
                    <strong>Preview:</strong>
                    <ul className="mt-2 mb-0">
                      <li><strong>{formData.title}</strong> - {formData.quantity} {formData.quantityUnit}</li>
                      <li>{formData.description}</li>
                      <li>📍 {formData.city}</li>
                      <li>📁 {formData.category}</li>
                      {formData.tags.length > 0 && <li>🏷️ {formData.tags.join(', ')}</li>}
                    </ul>
                  </Alert>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mb-2"
                    disabled={loading}
                  >
                    {loading ? 'Listing...' : '✅ List Food'}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={() => setStep(1)}
                    className="w-100"
                  >
                    Back
                  </Button>
                </>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default AddFood;
