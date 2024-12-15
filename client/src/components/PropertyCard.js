import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import config from './config.json';
import { formatDate, formatStatus } from '../helpers/formatter';

export default function PropertyCard({ propertyId, handleClose }) {
  const [propertyData, setPropertyData] = useState({});
  const [disasters, setDisasters] = useState([]);

  // Fetch property details and associated disasters on propertyId change
  useEffect(() => {
    if (propertyId) {
      // Fetch property details
      fetch(`http://${config.server_host}:${config.server_port}/search_properties?property_id=${propertyId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPropertyData(data[0]); 
          }
        })
        .catch(err => console.error('Error fetching property data:', err));

      // Fetch disasters associated with the property
      fetch(`http://${config.server_host}:${config.server_port}/get_disasters_for_property?property_id=${propertyId}`)
        .then(res => res.json())
        .then(resJson => {
          const disastersWithId = resJson.map(disaster => ({ id: disaster.disaster_id, ...disaster }));
          setDisasters(disastersWithId);
          })
        .catch(err => console.error('Error fetching disaster data:', err));
    }
  }, [propertyId]);

  // Column definitions for the DataGrid
  const columns = [
    { field: 'disaster_id', headerName: 'Disaster ID', width: 150 },
    { field: 'disasternumber', headerName: "Disaster Number", width: 150 },
	  { field: 'type_code', headerName: "Type Code", width: 150 },
    { field: 'designateddate', headerName: 'Designated Date', width: 150, valueGetter: (value) => {return formatDate(value)}, },
	  { field: 'type_description', headerName: 'Description', width: 300}
  ];

  /**
   * Get the total number of disasters.
   * @returns {number} - Total disasters associated with the property.
   */
  const num_disasters = () => disasters.length;

  /**
   * Get the most recent disaster's date.
   * @returns {string} - Formatted date of the most recent disaster or 'N/A'.
   */
  const most_recent_disaster = () => {
    if (disasters.length > 0) {
      const sortedDisasters = [...disasters].sort(
        (a, b) => new Date(b.designateddate) - new Date(a.designateddate)
      );
      return formatDate(sortedDisasters[0].designateddate);
    }
    return 'N/A';
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '2px solid #000',
          width: 1000,
          height: 800,
          overflow: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Property Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ ml: 'auto' }} 
          >
            <CloseIcon />
          </IconButton>
        </Box>
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
        <Typography variant="h6" gutterBottom>
          Status: {formatStatus(propertyData.status) || 'N/A'}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          Disaster Details
        </Typography>
        <Typography variant="h6">
          Total Disasters: {num_disasters()}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Last Disaster: {most_recent_disaster()}
        </Typography>
        <DataGrid
          rows={disasters}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </Modal>
  );
}
