//Update
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';



function EditSamplingPlace(){
    const navigate = useNavigate(); 


    const {id} = useParams();
    const [places, setPlaces] = useState([]);
    const [sampling_places, setSamplingPlaces] = useState([]);
    //Для виключення за _id у випадку редагування збоїв перевірки унікальності за тим же _id(name_place, longitude, latitude)
    const [excludeSamplingPlaces, setExcludeSamplingPlaces] = useState([])
    
    const [sampling_place, setSamplingPlace] = useState({
        region: '',
        name_place: '',
        type_water_object: '',
        name_water_object: '',
        longitude: '',
        latitude: '',
        comment: '',
    });

    const [selectCountry, setSelectCountry] = useState('');
    const [selectRegion, setSelectRegion] = useState('');
    const [selectTypeWaterObject, setSelectTypeWaterObject] = useState('');

    const [errors, setErrorMessages] = useState([]);


    //Робимо фільтри та уніки для таких властивостей як region і country за зворотньою сумісністю по зовнішніх ключах

    const [uniqCountry, setUniqCountry] = useState([]);
    const [uniqRegion, setUniqRegion] = useState([]);
    
    useEffect(() => {
        fetchDownloadElements();
    }, []);


    const fetchDownloadElements = async () => {
      try {
        //places aprt
          const responsePlaces = await axios.get('/api/places');
          const placesData = responsePlaces.data;
          setPlaces(placesData);


        //sampling_places part
          const responseSamplingPlaces = await axios.get('/api/sampling_places');
          const samplingPlacesData = responseSamplingPlaces.data;
          const excludeSamplingPlaces = samplingPlacesData.filter(place => place._id !== id)
          setExcludeSamplingPlaces(excludeSamplingPlaces);
          setSamplingPlaces(samplingPlacesData);

        //sampling_place part
          const responseSamplingPlace = await axios.get(`/api/edit-sampling-places/${id}`);
          const samplingPlaceData = responseSamplingPlace.data;
          setSamplingPlace(samplingPlaceData);

        //activation this is all in state across method
        fetchPlacesbySamplingPlaces(placesData, samplingPlacesData, samplingPlaceData, excludeSamplingPlaces);
      } catch (err) {
          console.log('Error fetching data', err);
      }
  };



    const fetchPlacesbySamplingPlaces = async (places, sampling_places, sampling_place, exclude_sampling_places) => {
      try{
        //зворотна сумісність
        const filterRegionByRegionFirst = places.filter(place => sampling_place.region.includes(place.region))

        console.log('filterRegionByRegionFirst:', filterRegionByRegionFirst)
        const uniqCountryInv = [...new Set(filterRegionByRegionFirst.map(place => place.country))].sort((a, b) => a.localeCompare(b));
        const selectCountry = uniqCountryInv[0]; // саме це значення ми використаємо для відображення при завантажені сторінки із початковими даними
        setSelectCountry(selectCountry);

        //Old School
        const uniqCountryList = [...new Set(places.map(place => place.country))].sort((a, b) => a.localeCompare(b));
        setUniqCountry(uniqCountryList);

        const fitlerRegionsByCountry = places.filter(place => selectCountry === place.country);
        const uniqPlacesRegionList = [...new Set(fitlerRegionsByCountry.map(place => place.region))].sort((a, b) => a.localeCompare(b));

        const filterRegionByRegionSecond = sampling_places.filter(place => uniqPlacesRegionList.includes(place.region));
        const uniqSPRegionList = [...new Set(filterRegionByRegionSecond.map(place => place.region))].sort((a, b) => a.localeCompare(b));

        setSelectRegion(sampling_place.region);
        setUniqRegion(uniqSPRegionList);

      }catch(err){
        console.log('Not completed connect database Places with sampling_places', err);
      }
    }


    const handleChangeCountry = (event) => {
      const selectCountry = event.target.value;
      setSelectCountry(selectCountry)
      setSelectRegion('')

      const fitlerRegionsByCountry = places.filter(place => selectCountry === place.country);
      const uniqPlacesRegionList = [...new Set(fitlerRegionsByCountry.map(place => place.region))].sort((a, b) => a.localeCompare(b));

      const filterRegionByRegionSecond = sampling_places.filter(place => uniqPlacesRegionList.includes(place.region));
      const uniqSPRegionList = [...new Set(filterRegionByRegionSecond.map(place => place.region))].sort((a, b) => a.localeCompare(b));
      setUniqRegion(uniqSPRegionList);
    }



    const handleChangeRegion = (event) => {
        const selectRegion = event.target.value;
        setSelectRegion(selectRegion);

        setSamplingPlace({
          ...sampling_place,
          region: selectRegion,
        });

        // const filterRegionByRegionSecond = sampling_places.filter(place => place.region === selectRegion);
        // const uniqSPRegionList = [... new Set(filterRegionByRegionSecond.map(place => place.region))].sort((a, b) => a.localeCompare(b));
        // setUniqRegion(uniqSPRegionList);

    }

    const handleChangeTypeWaterObject = (event) => {
        const selectTypeWaterObject = event.target.value;
        setSelectTypeWaterObject(selectTypeWaterObject);
        setSamplingPlace({
          ...sampling_place,
          type_water_object: selectTypeWaterObject,
        });
    }



    const handleSubmit = async (event) => {
        event.preventDefault();
        const { region, name_place, type_water_object, name_water_object, longitude, latitude } = event.target;
        const errors = [];

        if (!region.value) {
            errors.region = "fill in region field";
          }
    
          if(!name_place.value){
            errors.name_place = "fill in name place field";
          }
    
          if(!type_water_object.value){
            errors.type_water_object = "fill in type water object field";
          }
          if(!name_water_object.value){
            errors.name_water_object = "fill in name water object field";
          }
    
          const regexLongitude= /^(-)?(([0-8]?[0-9])(\.\d{1,6})?)$|90$/
          const regexLatitude= /^(-)?((1?[0-7]?[0-9])(\.\d{1,6})?)$|180$/

      
    
          if(!longitude.value|| !regexLongitude.test(longitude.value)){
            if(!longitude.value){
              errors.longitude = "fill coordinate x field";
            }
            else{
              errors.longitude = "error format, need form -90 to 90, characters after dote max 6";
            }
          }
    
          if(!latitude.value || !regexLatitude.test(latitude.value)){
            if(!latitude.value){
              errors.latitude ="fill coordinate y field";
            }
            else{
              errors.latitude ="error format, need form -180 to 180, characters after dote max 6";
            }
          }
          
          const existingPlaceWithName = excludeSamplingPlaces.find(place => place.name_place === name_place.value);  
          if (existingPlaceWithName) {
            errors.place_match = "This name place is already taken"
          } 
    
          const existingPlaceWithCoordinates = excludeSamplingPlaces.find(place => place.longitude === longitude.value && place.latitude === latitude.value);
          if (existingPlaceWithCoordinates) {
            errors.coordinates_match =  "These coordinates are already taken";
          }

          if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
          }
        try {
            // Використовуйте тут ваш серверний URL для оновлення даних
            const response = await axios.put(`/api/edit-sampling-places/${id}/update`, sampling_place);
            const updatedPlace = response.data;
            console.log('Data updated:', updatedPlace);
            navigate('/searchSamplingPlaces');
        } catch (error) {
            console.error('Error updating data:', error);
           
        }
    };

    return(
        <div>
          <h1>Change sampling place</h1>
          <div className="edit-sampling-place">
            <h2>Country</h2>
            <select name="country" onChange={handleChangeCountry} value={selectCountry}>
              {uniqCountry.map(place => (
                <option value={place} key={place}>{place}</option>
              ))}
            </select>
            <form onSubmit={handleSubmit}>
                <h2>Region</h2>
                <select name="region" onChange={handleChangeRegion} value={selectRegion}>
                    {uniqRegion.map(place => (
                        <option key={place} value={place}>{place}</option>
                    ))}
                </select>
                <h2>Name place</h2>
                <input type="text" name="name_place" value={sampling_place.name_place}
                  onChange={(event) => {
                    setSamplingPlace({
                      ...sampling_place,
                      name_place: event.target.value,
                    });}} />
                {errors.name_place && <p className='errors_edit_sp'>{errors.name_place}</p>}
                {errors.place_match && <p className='errors_edit_sp'>{errors.place_match}</p>} 
                <h2>Type water object</h2>
                <select name="type_water_object" onChange={handleChangeTypeWaterObject} value={selectTypeWaterObject === "" ? sampling_place.type_water_object : selectTypeWaterObject}>
                    <option value="lake">lake</option>
                    <option value="ocean">ocean</option>
                    <option value="reservior">reservior</option>
                    <option value="river">river</option>
                    <option value="sea">sea</option>
                </select>
                <h2>Name water object</h2>
                <input type="text" name="name_water_object" value={sampling_place.name_water_object} onChange={(event) => {
                    setSamplingPlace({
                      ...sampling_place,
                      name_water_object: event.target.value,
                    });}}/>
                  {errors.name_water_object && <p className='errors_edit_sp'>{errors.name_water_object}</p>}
                <h2>Longitude</h2>
                <input type="text" name="longitude" value={sampling_place.longitude}  
                onChange={(event) => {
                    setSamplingPlace({
                      ...sampling_place,
                      longitude: event.target.value,
                    });}} />
                  {errors.coordinates_match && <p className='errors_edit_sp'>{errors.coordinates_match}</p>}
                  {errors.longitude && <p className='errors_edit_sp'>{errors.longitude}</p>}
                <h2>Latitude</h2>
                <input type="text" name="latitude" value={sampling_place.latitude} JSON
                 onChange={(event) => {
                    setSamplingPlace({
                      ...sampling_place,
                      latitude: event.target.value,
                    });}}/>
                    {errors.coordinates_match && <p className='errors_edit_sp'>{errors.coordinates_match}</p>}
                    {errors.latitude && <p className='errors_edit_sp'>{errors.latitude}</p>}
                <h2>Comment</h2>
                <input type="text" name="comment" value={sampling_place.comment} onChange={(event) => {
                    setSamplingPlace({
                      ...sampling_place,
                      comment: event.target.value,
                    });}}/>
                <input type="submit" value="Edit"/>
            </form>
            </div>
        </div>
    );
}


export default EditSamplingPlace;
