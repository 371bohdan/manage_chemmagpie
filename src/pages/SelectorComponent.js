import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectorComponent() {
    const [places, setPlaces] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [samplingPlaces, setSamplingPlaces] = useState([]);
    const [waterObjects, setWaterObjects] = useState([]);

  useEffect(() => {
    // Отримати список місць з бази даних
    axios.get('/api/places')
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Отримати список місць для вибраного регіону
    if (selectedRegion) {
      axios.get(`/api/sampling_places?region=${selectedRegion}`)
        .then(response => {
          setSamplingPlaces(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    // Отримати список водних об'єктів для вибраного регіону
    if (selectedRegion) {
      axios.get(`/api/sampling_places/water-objects?region=${selectedRegion}`)
        .then(response => {
          setWaterObjects(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [selectedRegion]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setSelectedCountry(selectedCountry);

    // Очистити вибраний регіон та водні об'єкти, коли країна змінюється
    setSelectedRegion('');
    setWaterObjects([]);
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setSelectedRegion(selectedRegion);
  };

  return (
    <div>
      <label htmlFor="country">Country:</label>
      <select id="country" value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Select a country</option>
        {places.map(place => (
          <option key={place.country} value={place.country}>{place.country}</option>
        ))}
      </select>

      <label htmlFor="region">Region:</label>
      <select id="region" value={selectedRegion} onChange={handleRegionChange}>
        <option value="">Select a region</option>
        {places
          .filter(place => place.country === selectedCountry)
          .map(place => (
            <option key={place.region} value={place.region}>{place.region}</option>
          ))}
      </select>

      <label htmlFor="samplingPlaces">Sampling Places:</label>
      <select id="samplingPlaces">
        <option value="">Select a sampling place</option>
        {samplingPlaces.map(samplingPlace => (
          <option key={samplingPlace.name_place} value={samplingPlace.name_place}>
            {samplingPlace.name_place}
          </option>
        ))}
      </select>

      <label htmlFor="waterObjects">Water Objects:</label>
      <select id="waterObjects">
        <option value="">Select a water object</option>
        {waterObjects.map(waterObject => (
          <option key={waterObject.type_water_object} value={waterObject.type_water_object}>
            {waterObject.type_water_object}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectorComponent;
