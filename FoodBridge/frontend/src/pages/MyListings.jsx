import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Table } from 'react-bootstrap';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchListings();
  }, [filterStatus]);

  const fetchListings = async () => {
    try {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const response = await api.get(`/food/donor/my-listings${params}`);
      setListings(response.data.data);
    } catch (error) {
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/food/${id}`);
        toast.success('Listing deleted');
        fetchListings();
      } catch (error) {
        toast.error('Error deleting listing');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-5">
      <h2 className="mb-4">📋 My Listings</h2>

      <div className="mb-4">
        <Button
          variant={filterStatus === '' ? 'primary' : 'outline-primary'}
          onClick={() => setFilterStatus('')}
          className="me-2"
        >
          All
        </Button>
        <Button
          variant={filterStatus === 'available' ? 'primary' : 'outline-primary'}
          onClick={() => setFilterStatus('available')}
          className="me-2"
        >
          Available
        </Button>
        <Button
          variant={filterStatus === 'claimed' ? 'primary' : 'outline-primary'}
          onClick={() => setFilterStatus('claimed')}
          className="me-2"
        >
          Claimed
        </Button>
        <Button
          variant={filterStatus === 'expired' ? 'primary' : 'outline-primary'}
          onClick={() => setFilterStatus('expired')}
        >
          Expired
        </Button>
      </div>

      {listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id}>
                <td>{listing.title}</td>
                <td>{listing.quantity} {listing.quantityUnit}</td>
                <td>
                  <Badge bg={listing.status === 'available' ? 'success' : listing.status === 'claimed' ? 'info' : 'secondary'}>
                    {listing.status}
                  </Badge>
                </td>
                <td>{new Date(listing.expiresAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyListings;
