import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Slider, TextField, Link, Box, Checkbox } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { favorites, addFavorite, removeFavorite } from './Favorites';

export default function FindHouses() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
 
  const [propertyId, setPropertyId] = useState('');
  const [countyName, setCountyName] = useState('');
  const [state, setState] = useState(''); 
  const [status, setStatus] = useState('');
  const [price, setPrice] = useState([0, 5000000]);
  const [bathrooms, setBathrooms] = useState([0, 10]);
  const [bedrooms, setBedrooms] = useState([0, 20]);
  const [acres, setAcres] = useState([0, 5]);


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_properties`)
      .then(res => res.json())
      .then(resJson => {
        const propertiesWithId = resJson.map(property => ({ 
          id: property.property_id, ...property,
        }));
        setData(propertiesWithId);
      });
  }, []);

  const handleFavoriteToggle = (id) => {
    favorites.includes(id) ? removeFavorite(id) : addFavorite(id);
    console.log("hi")
    console.log(favorites);
  };

  const search = () => {
    const query = `http://${config.server_host}:${config.server_port}/search_properties?` +
      `property_id=${propertyId}&county_name=${countyName}&state=${state}&status=${status}` +
      `&price_low=${price[0]}&price_high=${price[1]}` +
      `&bathrooms_low=${bathrooms[0]}&bathrooms_high=${bathrooms[1]}` +
      `&bedrooms_low=${bedrooms[0]}&bedrooms_high=${bedrooms[1]}` +
      `&acres_low=${acres[0]}&acres_high=${acres[1]}`;

    fetch(query)
      .then(res => res.json())
      .then(resJson => {
        const propertiesWithId = resJson.map(property => ({ id: property.property_id, ...property }));
        setData(propertiesWithId);
      });
  }

  const resetFilters = () => {
    setPropertyId('');
    setCountyName('');
    setState('');
    setStatus('');
    setPrice([0, 5000000]);
    setBathrooms([0, 10]);
    setBedrooms([0, 20]);
    setAcres([0, 5]);
  }

  const columns = [
    { field: 'property_id', headerName: 'Property ID', width: 150 },
    { field: 'county_name', headerName: 'City', width: 150 },
	  { field: 'state', headerName: "State", width: 150 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'bathrooms', headerName: 'Bathrooms' },
    { field: 'bedrooms', headerName: 'Bedrooms' },
    { field: 'acre_lot', headerName: 'Acres' },
    { field: 'status', headerName: 'Status' },
    {
      field: 'fav',
      headerName: 'Favorites',
      width: 130,
      renderCell: (params) => (
        <Checkbox
          checked={params.value || favorites.includes(params.id)}
          onChange={() => handleFavoriteToggle(params.id)}
          color="primary"
        />
      ),
      disableClickEventBubbling: true,
    }
  ];

  return (
    <Container>
      <PageNavbar active='FindHouses' />
      <h2>Search Properties</h2>
      <Grid container spacing={2}>
	 	    <Grid item xs={12} sm={6}>
          <TextField 
          label='Property ID' 
          value={propertyId} 
          onChange={(e) => setPropertyId(e.target.value)} 
          fullWidth 
        />
        </Grid>
		    <Grid item xs={12} sm={6}>
          <Box display="flex" justifyContent="space-between">
		  	    <Button 
              variant={status === 'for_sale' ? "contained" : "outlined"} 
              onClick={() => setStatus('for_sale')} 
              sx={{ flex: 1, marginX: 0.5 }}>
                For Sale
            </Button>
            <Button 
              variant={status === 'sold' ? "contained" : "outlined"} 
              onClick={() => setStatus('sold')} 
              sx={{ flex: 1, marginX: 0.5 }}>
                Sold
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label='City' 
            value={countyName} 
            onChange={(e) => setCountyName(e.target.value)} 
            fullWidth />
        </Grid>
		    <Grid item xs={12} sm={6}>
          <TextField 
            label='State' 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            fullWidth />
        </Grid>
        <Grid item xs={12}>
          <p>Price</p>
          <Slider
            value={price}
            min={0}
            max={5000000}
            step={50000}
            onChange={(e, newValue) => setPrice(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p>Bathrooms</p>
          <Slider
            value={bathrooms}
            min={0}
            max={10}
            step={1}
            onChange={(e, newValue) => setBathrooms(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p>Bedrooms</p>
          <Slider
            value={bedrooms}
            min={0}
            max={20}
            step={1}
            onChange={(e, newValue) => setBedrooms(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={12}>
          <p>Acres</p>
          <Slider
            value={acres}
            min={0}
            max={5}
            step={0.2}
            onChange={(e, newValue) => setAcres(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
		<Grid item xs={12}>
        <Box display="flex" justifyContent="space-between">
		  	<Button 
          variant="contained" 
          onClick={search} 
          sx={{ flex: 1, marginX: 0.5, marginY: 2}}
        >
              Search
            </Button>
            <Button 
              variant="contained" 
              onClick={resetFilters} 
              sx={{ flex: 1, marginX: 0.5, marginY: 2}}
            >
                Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
