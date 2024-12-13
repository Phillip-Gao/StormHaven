import React, { useState, useEffect } from 'react';
import { Grid, Container, List, ListItem, Typography, Button } from '@mui/material';
import FindHouses from './FindHouses';
import { createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatStatus } from '../helpers/formatter';

export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

export function addFavorite(id) {
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function removeFavorite(id) {
  const index = favorites.indexOf(id);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export default function Favorites() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const promises = favorites.map(id =>
        fetch(`http://${config.server_host}:${config.server_port}/search_properties?property_id=${id}`)
          .then(res => res.json())
      );
      const results = await Promise.all(promises);
      const detailedData = results.flat().map(property => ({
        id: property.property_id,
        ...property,
      }));
      setData(detailedData);
    };

    fetchFavorites();
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    window.location.reload();
  };

  const handleAddNote = (id, note) => {
    const updatedData = data.map(property => 
      property.id === id ? { ...property, note } : property
    );
    setData(updatedData);
    localStorage.setItem('favorites', JSON.stringify(updatedData));
  };

  const columns = [
    { field: 'property_id', headerName: 'Property ID' },
    { field: 'county_name', headerName: 'City' },
    { field: 'state', headerName: 'State' },
    { field: 'price', headerName: 'Price' },
    { field: 'bathrooms', headerName: 'Bathrooms' },
    { field: 'bedrooms', headerName: 'Bedrooms' },
    { field: 'acre_lot', headerName: 'Acres' },
    { field: 'status', headerName: 'Status', valueGetter: (value) => {return formatStatus(value) }}, 
    {
      field: 'remove',
      headerName: 'Remove',
      width: 125,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRemove(params.id)}
        >
          Remove
        </Button>
      ),
      disableClickEventBubbling: true,
    },
  ];

  return (
    <Container>
      <PageNavbar active="Favorites" />
      <h2>Your Favorites</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
      />
    </Container>
  );
}