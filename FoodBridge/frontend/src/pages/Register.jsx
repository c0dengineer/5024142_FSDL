import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import '../styles/Auth.css';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    city: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    } else if (step === 2) {
      if (!formData.role) newErrors.role = 'Please select a role';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: '' }));
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    } else {
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      city: formData.city,
      phone: formData.phone,
    });

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="auth-page">
      <Container>
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <Card className="auth-card">
              <Card.Body>
                <div className="auth-header">
                  <h2>Join FoodBridge 🍱</h2>
                  <p>Create your account in {3 - step} steps</p>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      style={{ width: `${(step / 2) * 100}%` }}
                    />
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  {step === 1 ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                          placeholder="Enter your name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="password-group">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            placeholder="At least 6 characters"
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm your password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        variant="primary"
                        onClick={handleNext}
                        className="w-100 btn-submit"
                      >
                        Next Step
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Your Role</Form.Label>
                        <div className="role-selector">
                          <Button
                            variant={
                              formData.role === 'donor'
                                ? 'primary'
                                : 'outline-secondary'
                            }
                            className="role-btn"
                            onClick={() => handleRoleSelect('donor')}
                          >
                            <span className="role-icon">🥘</span>
                            <span className="role-title">Food Donor</span>
                            <span className="role-desc">Share excess food</span>
                          </Button>
                          <Button
                            variant={
                              formData.role === 'receiver'
                                ? 'primary'
                                : 'outline-secondary'
                            }
                            className="role-btn"
                            onClick={() => handleRoleSelect('receiver')}
                          >
                            <span className="role-icon">🙋</span>
                            <span className="role-title">Food Receiver</span>
                            <span className="role-desc">Request food</span>
                          </Button>
                        </div>
                        {errors.role && (
                          <div className="invalid-feedback d-block">
                            {errors.role}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Your city"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone (Optional)</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-submit"
                        disabled={loading}
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>

                      <Button
                        variant="outline-secondary"
                        onClick={() => setStep(1)}
                        className="w-100 mt-2"
                      >
                        Back
                      </Button>
                    </>
                  )}
                </Form>

                <div className="auth-footer">
                  <p>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                      Login here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="auth-illustration">
            <div className="illustration-content">
              <h3>Together We Can<br />End Food Waste 🌍</h3>
              <p>Join thousands making a difference</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
