import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import '../styles/Home.css';

const FoodListingPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    tag: '',
    sort: 'newest',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
    'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  ];

  const categories = ['cooked', 'raw', 'packaged', 'beverage', 'other'];
  const tags = ['veg', 'non-veg', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'];

  const fetchFoods = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      });

      const response = await api.get(`/food?${params}`);
      setFoods(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search would filter client-side or be sent to backend
    setSearchTerm(e.target.value);
  };

  if (loading && foods.length === 0) return <Loader />;

  return (
    <div className="food-listing-page">
      {/* Search Hero */}
      <section className="search-hero py-5">
        <Container>
          <h1 className="text-center mb-4">Find Food Near You 🔍</h1>
          <Form onSubmit={(e) => e.preventDefault()} className="search-form">
            <Form.Control
              type="text"
              placeholder="Search for specific food..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5">
        <Row>
          {/* Filters Sidebar */}
          <Col lg={3} className="mb-4">
            <div className="filters-card">
              <h5 className="mb-4">Filters</h5>

              <Form.Group className="mb-4">
                <Form.Label>City</Form.Label>
                <Form.Select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Dietary Tag</Form.Label>
                <Form.Select
                  name="tag"
                  value={filters.tag}
                  onChange={handleFilterChange}
                >
                  <option value="">All Tags</option>
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="expiring-soon">Expiring Soon</option>
                  <option value="most-views">Most Popular</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() =>
                  setFilters({
                    city: '',
                    category: '',
                    tag: '',
                    sort: 'newest',
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          </Col>

          {/* Food Grid */}
          <Col lg={9}>
            {foods.length === 0 ? (
              <div className="no-results text-center py-5">
                <h3>😔 No food listings found</h3>
                <p>Try adjusting your filters or check back later!</p>
              </div>
            ) : (
              <>
                <Row>
                  {foods.map((food) => (
                    <Col md={6} lg={4} key={food._id} className="mb-4">
                      <FoodCard food={food} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination-controls text-center my-5">
                    <Button
                      variant="outline-primary"
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        fetchFoods(pagination.currentPage - 1)
                      }
                    >
                      ← Previous
                    </Button>
                    <span className="mx-3">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline-primary"
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      onClick={() =>
                        fetchFoods(pagination.currentPage + 1)
                      }
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FoodListingPage;
