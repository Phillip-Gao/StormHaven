import React, { useState, useEffect } from 'react';
import { Grid, Container, List, ListItem, Typography } from '@mui/material';
import FindHouses from './FindHouses';
import { createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';

export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

export function addFavorite (id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
		localStorage.setItem('favorites', JSON.stringify(favorites));
    }
};

export function removeFavorite (id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
		localStorage.setItem('favorites', JSON.stringify(favorites));
    }
};

export default function Favorites() {
  return (
    <Container>
        <PageNavbar active='Favorites' />
        <h2>View Favorites</h2>
        <Grid container spacing={2}>
          <List>
              {favorites.map(fav => (
                  <ListItem key={fav}>
                      Property ID: {fav}
                  </ListItem>
              ))}
          </List>
        </Grid>
    </Container>
  );
}
