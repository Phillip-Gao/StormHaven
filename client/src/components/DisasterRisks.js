import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageNavbar from './PageNavbar';
import config from './config.json';
import { formatDate, exportDate } from '../helpers/formatter';

export default function DisasterRisks() {

  // State variables for managing table data and filters
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [disasterId, setDisasterId] = useState('');
  const [disasterNumber, setDisasterNumber] = useState('');
  const [typeCode, setTypeCode] = useState('');
  const [countyName, setCountyName] = useState('');
  const [designatedDateLow, setDesignatedDateLow] = useState('');
  const [designatedDateHigh, setDesignatedDateHigh] = useState('');

  // Fetch disaster data and trends on initial render
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_disasters`)
		.then(res => res.json())
		.then(resJson => {
		  const disastersWithId = resJson.map(disaster => ({ id: disaster.disaster_id, ...disaster }));
		  setData(disastersWithId);
		});
    fetch(`http://${config.server_host}:${config.server_port}/disaster-trends`)
      .then(res => res.json())
      .then(resJson => {
        const trendsWithId = resJson.map(trend => ({ id: trend.index, ...trend }));
        setTrendsData(trendsWithId);
      });
	}, []);

  // Constructs and executes a search query based on filters
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

  // Disaster type codes and their descriptions
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
    { code: 'OTH', description: 'Other' },
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
  
  // Handles changes in disaster type code selection
  const handleTypeCodeChange = (event) => {
    setTypeCode(event.target.value);
  };

  // Finds the code corresponding to a type description
  function getCodeByDescription(description) {
    const type = typeCodes.find(type => type.description === description);
    return type ? type.code : 'Description not found';
  }
  
  // Resets all filter inputs to default values
  const resetFilters = () => {
    setDisasterId('');
    setDisasterNumber('');
    setCountyName('');
    setDesignatedDateLow('');
    setDesignatedDateHigh('');
    setTypeCode('');
  }

  // Column configurations for the DataGrid components
  const columns = [
    { field: 'disaster_id', headerName: 'Disaster ID', width: 150 },
    { field: 'disasternumber', headerName: "Disaster Number", width: 150 },
	  { field: 'type_code', headerName: "Type Code", width: 150 },
    { field: 'county_name', headerName: 'City', width: 200 },
    { field: 'designateddate', headerName: 'Designated Date', width: 200, valueGetter: (value) => {return formatDate(value)}, },
	  { field: 'type_description', headerName: 'Description', width: 300}
  ];

  const trendsColumns = [
    { field: 'year', headerName: 'Year', width: 350 },
    { field: 'type_description', headerName: 'Disaster Type', width: 350 },
    { field: 'disaster_count', headerName: 'Disaster Count', width: 350 }
  ];

  return (
    <Container>
      {/* Navbar for navigation */}
      <PageNavbar active="DisasterRisks" />

      {/* Disaster Search Section */}
      <h2>Search Disasters</h2>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Disaster Number"
            value={disasterNumber}
            onChange={(e) => setDisasterNumber(e.target.value)}
            fullWidth
          />
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
                <MenuItem key={index} value={type.code}>
                  {type.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="City"
            value={countyName}
            onChange={(e) => setCountyName(e.target.value)}
            fullWidth
          />
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
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={search} sx={{ flex: 1, marginX: 0.5, marginY: 2 }}>
              Search
            </Button>
            <Button variant="contained" onClick={resetFilters} sx={{ flex: 1, marginX: 0.5, marginY: 2 }}>
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Results Table */}
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      {/* Trends Table */}
      <h2>Disaster Trends</h2>
      <DataGrid
        rows={trendsData}
        columns={trendsColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
