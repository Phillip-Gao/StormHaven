import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import config from './config.json';

export default function PropertyCard({ propertyId, handleClose }) {
  const [propertyData, setPropertyData] = useState({});

  useEffect(() => {
    if (propertyId) {
      // Fetch the specific property by its ID
      fetch(`http://${config.server_host}:${config.server_port}/search_properties?property_id=${propertyId}`)
        .then(res => res.json())
        .then(data => {
          // Since the endpoint should return a single property detail, 
          // we expect data to be an array with one object
          if (data && data.length > 0) {
            setPropertyData(data[0]); // Set the first item of the array to state
          }
        })
        .catch(err => console.error('Error fetching property data:', err));
    }
  }, [propertyId]);

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        bgcolor="background.paper"
        borderRadius={2}
        border="2px solid #000"
        width={600}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {'Property Details'}
        </Typography>
        <Typography variant="h6">
          Price: ${propertyData.price || 'N/A'}
        </Typography>
        <Typography variant="h6">
          Location: {propertyData.county_name || 'N/A'}, {propertyData.state || 'N/A'}
        </Typography>
        <Typography variant="h6">
          Bedrooms: {propertyData.bedrooms || 'N/A'}
        </Typography>
        <Typography variant="h6">
          Bathrooms: {propertyData.bathrooms || 'N/A'}
        </Typography>
        <Typography variant="h6">
          Acres: {propertyData.acre_lot || 'N/A'}
        </Typography>
        <Typography variant="h6">
          Status: {propertyData.status || 'N/A'}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          {'Disaster Details'}
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
