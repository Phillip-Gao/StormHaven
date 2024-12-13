import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatDate, exportDate } from '../helpers/formatter';

export default function DisasterRisks() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [disasterId, setDisasterId] = useState('');
  const [disasterNumber, setDisasterNumber] = useState('');
  const [typeCode, setTypeCode] = useState('');
  const [countyName, setCountyName] = useState('');
  const [designatedDateLow, setDesignatedDateLow] = useState('');
  const [designatedDateHigh, setDesignatedDateHigh] = useState('');
  // const [entryDate, setEntryDate] = useState('');
  // const [closeoutDate, setCloseoutDate] = useState('');

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
      `&designateddate_low=${exportDate(designatedDateLow, false)}&designateddate_high=${exportDate(designatedDateHigh, true)}&type_code=${typeCode}`;
	  fetch(query)
	  .then(res => res.json())
	  .then(resJson => {
		const disastersWithId = resJson.map(disaster => ({ id: disaster.disaster_id, ...disaster }));
		setData(disastersWithId);
	  });
  }

  const typeCodes = [
    { code: '403C', description: 'DoD' },
    { code: 'CC', description: 'Crisis Counseling' },
    { code: 'DFA', description: 'Direct Federal Assistance' },
    { code: 'DH', description: 'Disaster Housing' },
    { code: 'DUA', description: 'Disaster Unemployment Assistance' },
    { code: 'HA', description: 'Housing Assistance' },
    { code: 'HM', description: 'Hazard Mitigation' },
    { code: 'IA', description: 'Individual Assistance' },
    { code: 'IFG', description: 'Individual and Family Grant' },
    { code: 'IH', description: 'Individual Housing' },
    { code: 'OTH', description: 'Over the Horizon' },
    { code: 'PA', description: 'Public Assistance' },
    { code: 'PA-A', description: 'Public Assistance - Debris Removal' },
    { code: 'PA-B', description: 'Public Assistance - Protective Measures' },
    { code: 'PA-C', description: 'Public Assistance - Roads and Bridges' },
    { code: 'PA-D', description: 'Public Assistance - Water Control Facilities' },
    { code: 'PA-E', description: 'Public Assistance - Public Buildings and Contents' },
    { code: 'PA-F', description: 'Public Assistance - Public Utilities' },
    { code: 'PA-G', description: 'Public Assistance - Parks, Recreational, and Other Facilities' },
    { code: 'PA-H', description: 'Public Assistance - Fire Management Assistance' },
    { code: 'SBA', description: 'Small Business Administration' }
  ];

  const handleTypeCodeChange = (event) => {
    setTypeCode(event.target.value);
  };

  function getCodeByDescription(description) {
    const type = typeCodes.find(type => type.description === description);
    return type ? type.code : 'Description not found';
  }
  
  const resetFilters = () => {
    setDisasterId('');
    setDisasterNumber('');
    setCountyName('');
    setDesignatedDateLow('');
    setDesignatedDateHigh('');
    setTypeCode('');
    // setEntryDate('');
    // setCloseoutDate('');
  }

  const columns = [
    { field: 'disaster_id', headerName: 'Disaster ID', width: 100 },
    { field: 'disasternumber', headerName: "Disaster Number", width: 100 },
	  { field: 'type_code', headerName: "Type Code", width: 100 },
    { field: 'county_name', headerName: 'City', width: 150 },
    { field: 'designateddate', headerName: 'Designated Date', width: 150, valueGetter: (value) => {return formatDate(value)}, },
    // { field: 'entrydate', headerName: 'Entry Date', width: 150, valueGetter: (value) => {return formatDate(value)},  },
    // { field: 'closeoutdate', headerName: 'Closeout Date', width: 150, valueGetter: (value) => {return formatDate(value)}, },
	{ field: 'type_description', headerName: 'Description', width: 300}
  ];

  return (
    <Container>
      <PageNavbar active='DisasterRisks' />
      <h2>Search Disasters </h2>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField label='Disaster Number' value={disasterNumber} onChange={e => setDisasterNumber(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type Description</InputLabel>
            <Select
              value={typeCode}
              label="Type Description"
              onChange={handleTypeCodeChange}
              displayEmpty
            >
              {typeCodes.map((type, index) => (
                <MenuItem key={index} value={type.code}>{type.description}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField label='City' value={countyName} onChange={e => setCountyName(e.target.value)} fullWidth />
        </Grid>
		    <Grid item xs={12} sm={6}>
          <TextField
            label="Occurs After"
            type="date"
            value={designatedDateLow}
            onChange={(e) => setDesignatedDateLow(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Occurs Before"
            type="date"
            value={designatedDateHigh}
            onChange={(e) => setDesignatedDateHigh(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={12}>
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
		   </Grid>  */}
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
