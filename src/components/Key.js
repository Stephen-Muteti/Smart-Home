import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';


const Key = (props) => {
  const rows = [
    { condition: 'High', temperature: '36 - 100', humidity: '71 - 100' },
    { condition: 'Medium', temperature: '19 - 35', humidity: '25 - 70' },
    { condition: 'Low', temperature: '-40 - 18', humidity: '0 - 24' },
    { condition: 'Optimum', temperature: props.preferedTemperature, humidity: props.preferedHumidity },
  ];

  return (
    <SimpleBar className="table-responsive fire-reports-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Weather Condition</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>Humidity(%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.condition}>
                  <TableCell>{row.condition}</TableCell>
                  <TableCell>{row.temperature}</TableCell>
                  <TableCell>{row.humidity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SimpleBar>
  );
};

export default Key;
