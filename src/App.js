import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './assets/app.min.css';
import './assets/bootstrap.min.css';
import './assets/jsvectormap.min.css';
import './App.css';
import axios from 'axios';
import Header from './components/Header.js';
import Key from './components/Key.js';
import CustomTable from './components/Table.js';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const App = () => {
  const initialTemperature = parseFloat(localStorage.getItem('temperature')) || 0;
  const initialHumidity = parseFloat(localStorage.getItem('humidity')) || 0;

  const [temperature, setTemperature] = useState(initialTemperature);
  const [humidity, setHumidity] = useState(initialHumidity);
  const [temperatureError, setTemperatureError] = useState('');
  const [humidityError, setHumidityError] = useState('');
  const [temperatureLevel, setTemperatureLevel] = useState('');
  const [humidityLevel, setHumidityLevel] = useState('');
  const [preferedHumidity, setPreferedHumidity] = useState(45);
  const [preferedTemperature, setPreferedTemperature] = useState(19);
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
  });

  const [optimumFormData, setOptimumFormData] = useState({
    temperature: '',
    humidity: '',
  });


  const temperatureRanges = {
    low: { min: -40, max: 18 },
    medium: { min: 19, max: 35 },
    high: { min: 36, max: 100 }
  };

  const humidityRanges = {
    low: { min: 0, max: 24 },
    medium: { min: 25, max: 70 },
    high: { min: 71, max: 100 }
  };

  const updateLevels = () => {
    if (temperature >= temperatureRanges.low.min && temperature <= temperatureRanges.low.max) {
      setTemperatureLevel('low');
    } else if (
      temperature >= temperatureRanges.medium.min &&
      temperature <= temperatureRanges.medium.max
    ) {
      setTemperatureLevel('medium');
    } else if (temperature >= temperatureRanges.high.min) {
      setTemperatureLevel('high');
    }

    if (humidity >= humidityRanges.low.min && humidity <= humidityRanges.low.max) {
      setHumidityLevel('low');
    } else if (humidity >= humidityRanges.medium.min && humidity <= humidityRanges.medium.max) {
      setHumidityLevel('medium');
    } else if (humidity >= humidityRanges.high.min) {
      setHumidityLevel('high');
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('WebSocket connected!');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('data-update', (data) => {
      setTemperature(data.temperature);
      setHumidity(data.humidity);

      localStorage.setItem('temperature', data.temperature.toString());
      localStorage.setItem('humidity', data.humidity.toString());
    });

    socket.on('preference-update', (data) => {
      setPreferedTemperature(data.temperature);
      setPreferedHumidity(data.humidity);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    updateLevels();
  }, [temperature, humidity]);

   const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleOptimumInputChange = (event) => {
    const { name, value } = event.target;
    setOptimumFormData((prevOptimumFormData) => ({ ...prevOptimumFormData, [name]: value }));
  };

  const handleSubmitOptimumData = (e) => {
    e.preventDefault()

    axios.post('http://localhost:5000/prefer', optimumFormData)
      .then((response) => {
        console.log('API Response:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error);
    });
  };


  const handleSubmitCurrentData = (e) => {
    e.preventDefault();
    // Use Axios to make a POST request with JSON data
    axios.post('http://localhost:5000/data', formData)
      .then((response) => {
        console.log('API Response:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error);
    });
};

    useEffect(() => {
    updateLevels();
  }, [temperature, humidity, preferedHumidity, preferedTemperature]);

  return (
    <div id="layout-wrapper">
      <Header />
      <div className="main-content">
        <SimpleBar className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-8">
                <div className="card card-h-100">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Weather Data</h4>
                    <CustomTable
                      temperature={temperature}
                      humidity={humidity}
                      humidityLevel={humidityLevel}
                      temperatureLevel={temperatureLevel}
                      preferedTemperature={preferedTemperature}
                      preferedHumidity={preferedHumidity}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="card card-h-100">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Weather Chart</h4>
                    <Key preferedTemperature={preferedTemperature} preferedHumidity={preferedHumidity} />
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="row">
              <div className="col-xl-6 send-fire-report-form">
                <div className="card card-h-100">
                  <div className="card-header justify-content-between d-flex align-items-center">
                    <h4 className="card-title">Set Optimum Conditions</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmitOptimumData}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <TextField
                              required
                              id="formrow-firstname-input"
                              className="form-control"
                              label="Optimum Temperature"
                              value={optimumFormData.temperature}
                              onChange={handleOptimumInputChange}
                              name="temperature"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <TextField
                              required
                              id="formrow-firstname-input"
                              className="form-control"
                              label="Optimum Humidity"
                              value={optimumFormData.humidity}
                              onChange={handleOptimumInputChange}
                              name="humidity"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                          <button type="submit" className="btn btn-primary w-md">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 send-fire-report-form">
                <div className="card card-h-100">
                  <div className="card-header justify-content-between d-flex align-items-center">
                    <h4 className="card-title">Set Current Values</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmitCurrentData}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <TextField
                              required
                              id="formrow-firstname-input"
                              className="form-control"
                              label="Current Temperature"
                              helperText={temperatureError}
                              value={formData.temperature}
                              onChange={handleInputChange}
                              name="temperature"
                              error={temperatureError ? true : false}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <TextField
                              required
                              id="formrow-firstname-input"
                              className="form-control"
                              label="Current Humidity"
                              helperText={humidityError}
                              value={formData.humidity}
                              onChange={handleInputChange}
                              name="humidity"
                              error={humidityError ? true : false}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                          <button type="submit" className="btn btn-primary w-md">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default App;
