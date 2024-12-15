import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatStatus } from '../helpers/formatter';
import PropertyCard from './PropertyCard';

// Retrieve favorites from localStorage or initialize an empty array
export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

/**
 * Adds a property to favorites with an optional note.
 * Updates the localStorage to persist the data.
 * @param {string} id - Property ID to add to favorites
 */
export function addFavorite(id) {
  if (!favorites.some(fav => fav.id === id)) {
    favorites.push({ id, note: '' });
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

/**
 * Removes a property from favorites by ID.
 * Updates the localStorage to persist the data.
 * @param {string} id - Property ID to remove from favorites
 */
export function removeFavorite(id) {
  favorites = favorites.filter(fav => fav.id !== id); 
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * Updates the note for a property in favorites.
 * Updates the localStorage to persist the data.
 * @param {string} id - Property ID for which to update the note
 * @param {string} note - Note content to save
 */
export function updateNote(id, note) {
  favorites = favorites.map(fav => (fav.id === id ? { ...fav, note } : fav));
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export default function Favorites() {
  const [data, setData] = useState([]);

  // State to store property data
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Fetch detailed property data for all favorite properties
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

  // Remove a property from favorites and update the displayed data
  const handleRemove = (id) => {
    removeFavorite(id);
    setData(data.filter(property => property.id !== id));
  };

  /**
   * Adds or updates a note for a property.
   * Updates local state and persists changes to localStorage.
   * @param {string} id - Property ID
   * @param {string} note - Note content to add or update
   */
  const handleAddNote = (id, note) => {
    const updatedData = data.map(property => 
      property.id === id ? { ...property, note } : property
    );
    setData(updatedData);
    localStorage.setItem('favorites', JSON.stringify(updatedData));
  };

  // Update note for a property and persist it in state and localStorage
  const handleNoteChange = (id, note) => {
    updateNote(id, note);
    setData(data.map(property => (property.id === id ? { ...property, note } : property)));
  };

  // DataGrid column definitions
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