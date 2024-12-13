import React, { useState, useEffect } from 'react';
import { Grid, Container, List, ListItem, Typography, Button, TextField } from '@mui/material';
import FindHouses from './FindHouses';
import { createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatStatus } from '../helpers/formatter';
import PropertyCard from './PropertyCard'; 

export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

export function addFavorite(id) {
  if (!favorites.some(fav => fav.id === id)) {
    favorites.push({ id, note: '' });
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function removeFavorite(id) {
  favorites = favorites.filter(fav => fav.id !== id); 
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function updateNote(id, note) {
  favorites = favorites.map(fav => (fav.id === id ? { ...fav, note } : fav));
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export default function Favorites() {
  const [data, setData] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const promises = favorites.map(fav =>
        fetch(`http://${config.server_host}:${config.server_port}/search_properties?property_id=${fav.id}`)
          .then(res => res.json())
      );
      const results = await Promise.all(promises);
      const detailedData = results.flat().map(property => {
        const favorite = favorites.find(fav => fav.id === property.property_id);
        return { id: property.property_id, note: favorite?.note || '', ...property };
      });
      setData(detailedData);
    };

    fetchFavorites();
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setData(data.filter(property => property.id !== id));
  };

  const handleAddNote = (id, note) => {
    const updatedData = data.map(property => 
      property.id === id ? { ...property, note } : property
    );
    setData(updatedData);
    localStorage.setItem('favorites', JSON.stringify(updatedData));
  };

  const handleNoteChange = (id, note) => {
    updateNote(id, note);
    setData(data.map(property => (property.id === id ? { ...property, note } : property)));
  };

  const columns = [
    { field: 'property_id', headerName: 'Property ID', width: 150, renderCell: (params) => (
      <Button onClick={() => setSelectedPropertyId(params.id)}>{params.value}</Button>
    ) },
    { field: 'county_name', headerName: 'City' },
    { field: 'state', headerName: 'State' },
    { field: 'price', headerName: 'Price' },
    { field: 'bathrooms', headerName: 'Bathrooms' },
    { field: 'bedrooms', headerName: 'Bedrooms' },
    { field: 'acre_lot', headerName: 'Acres' },
    { field: 'status', headerName: 'Status', valueGetter: (value) => {return formatStatus(value)} },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200, 
      renderCell: (params) => (
        <TextField
          multiline
          defaultValue={params.row.note}
          onBlur={(e) => handleNoteChange(params.row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Add a note"
          fullWidth
          rows={Math.max(2, params.row.note.split('\n').length)}
        />
      ),
    },
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
      {selectedPropertyId && <PropertyCard propertyId={selectedPropertyId} handleClose={() => setSelectedPropertyId(null)} />}   
      <PageNavbar active="Favorites" />
      <h2>Your Favorites</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
        getRowHeight={() => 'auto'}
      />
    </Container>
  );
}