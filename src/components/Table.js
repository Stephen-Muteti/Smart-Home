import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const CustomTable = (props) => {
  const columns = [
    { id: 'condition', label: 'Weather Condition' },
    { id: 'conditionValue', label: 'Condition Value' },
    { id: 'status', label: 'Status' },
    { id: 'conditionCorrection', label: 'Condition Correction' },
  ];

  return (
    <SimpleBar className="table-responsive fire-reports-container">
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center" // Adjust alignment as needed
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Temperature</TableCell>
              <TableCell>{props.temperature}</TableCell>
              <TableCell>
                <div className="status-holder">
                  <span>{props.temperatureLevel}</span>
                  <div
                    className="visual-indicator"
                    style={{
                      backgroundColor:
                        props.temperatureLevel === 'low'
                          ? 'yellow'
                          : props.temperatureLevel === 'medium'
                          ? 'green'
                          : 'red',
                    }}
                  ></div>
                </div>
              </TableCell>
              <TableCell>{Math.abs(props.preferedTemperature - props.temperature)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Humidity</TableCell>
              <TableCell>{props.humidity} %</TableCell>
              <TableCell>
                <div className="status-holder">
                  <span>{props.humidityLevel}</span>
                  <div
                    className="visual-indicator"
                    style={{
                      backgroundColor:
                        props.humidityLevel === 'low'
                          ? 'yellow'
                          : props.humidityLevel === 'medium'
                          ? 'green'
                          : 'red',
                    }}
                  ></div>
                </div>
              </TableCell>
              <TableCell>{Math.abs(props.preferedHumidity - props.humidity)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SimpleBar>
  );
};

export default CustomTable;