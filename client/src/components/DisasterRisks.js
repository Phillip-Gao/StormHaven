import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatDate } from '../helpers/formatter';

export default function DisasterRisks() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [disasterId, setDisasterId] = useState('');
  const [disasterNumber, setDisasterNumber] = useState('');
  const [typeCode, setTypeCode] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [countyName, setCountyName] = useState('');
  const [designatedDate, setDesignatedDate] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [closeoutDate, setCloseoutDate] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_disasters`)
		.then(res => res.json())
		.then(resJson => {
		  const disastersWithId = resJson.map(disaster => ({ id: disaster.disaster_id, ...disaster }));
		  setData(disastersWithId);
		});
	}, []);

  const search = () => {
    const query = `http://${config.server_host}:${config.server_port}/search_disasters?` +
      `disaster_id=${disasterId}&disasternumber=${disasterNumber}&county_name=${countyName}` +
      `&designateddate=${designatedDate}&entrydate=${entryDate}&closeoutdate=${closeoutDate}`;
    
	  fetch(query)
	  .then(res => res.json())
	  .then(resJson => {
		const disastersWithId = resJson.map(disaster => ({ id: disaster.disaster_id, ...disaster }));
		setData(disastersWithId);
	  });
  }

  const resetFilters = () => {
    setDisasterId('');
    setDisasterNumber('');
    setCountyName('');
    setDesignatedDate('');
    setEntryDate('');
    setCloseoutDate('');
  }

  const columns = [
    { field: 'disaster_id', headerName: 'Disaster ID', width: 100 },
    { field: 'disasternumber', headerName: "Disaster Number", width: 100 },
	  { field: 'type_code', headerName: "Type Code", width: 100 },
    { field: 'county_name', headerName: 'City', width: 150 },
    { field: 'designateddate', headerName: 'Designated Date', width: 150, valueGetter: (value) => {return formatDate(value)}, },
    { field: 'entrydate', headerName: 'Entry Date', width: 150, valueGetter: (value) => {return formatDate(value)},  },
    { field: 'closeoutdate', headerName: 'Closeout Date', width: 150, valueGetter: (value) => {return formatDate(value)}, },
	{ field: 'type_description', headerName: 'Description', width: 300, valueGetter: (value) => {return formatDate(value)}, }
  ];

  return (
    <Container>
      <PageNavbar active='DisasterRisks' />
      <h2>Search Disaster Risks</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label='Disaster Number' value={disasterNumber} onChange={e => setDisasterNumber(e.target.value)} fullWidth />
        </Grid>
		<Grid item xs={12} sm={6}>
          <TextField label='Type Code' value={typeCode} onChange={e => setTypeCode(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label='City' value={countyName} onChange={e => setCountyName(e.target.value)} fullWidth />
        </Grid>
		<Grid item xs={12}>
          <TextField
            label="Designated Date"
            type="date"
            value={designatedDate}
            onChange={(e) => setDesignatedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Entry Date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Closeout Date"
            type="date"
            value={closeoutDate}
            onChange={(e) => setCloseoutDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
		</Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
		  	<Button variant="contained" onClick={search} sx={{ flex: 1, marginX: 0.5, marginY: 2}}>
              Search
            </Button>
            <Button variant="contained" onClick={resetFilters} sx={{ flex: 1, marginX: 0.5, marginY: 2}}>
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
