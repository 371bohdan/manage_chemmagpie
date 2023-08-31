//Update
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function EditSamplingPlace(){
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

    const [selectRegion, setSelectRegion] = useState('');
    const [selectTypeWaterObject, setSelectTypeWaterObject] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    

    useEffect(() => {
        fetchPlaces();
        fetchSamplingPlaceEdit();
        fetchSamplingPlaces();
    }, []);

    const fetchPlaces = async () => {
        try {
            const response = await axios.get('/api/places');
            const placesData = response.data;
            setPlaces(placesData);
            console.log(placesData)
        } catch (err) {
            console.log('Error fetching places data', err);
        }
    };

    
    const fetchSamplingPlaceEdit = async () => {
        try {
            const response = await axios.get(`/api/edit-sampling-places/${id}`);
            const samplingPlaceData = response.data;
            setSamplingPlace(samplingPlaceData);
        } catch (err) {
            console.log('Error fetching data for editing:', err);
        }
    }

    const fetchSamplingPlaces = async () => {
        try{
            const response = await axios.get('/api/sampling_places');
            const samplingPlacesData = response.data;
            const excludeSamplingPlaces = samplingPlacesData.filter(place => place._id !== id)
            setExcludeSamplingPlaces(excludeSamplingPlaces);
            setSamplingPlaces(samplingPlacesData);
        }catch(err){
            console.log('Error data from sampling_places:', err);
        }
    }

    const handleChangeRegion = (event) => {
        const selectRegion = event.target.value;
        setSelectRegion(selectRegion);
    }

    const handleChangeTypeWaterObject = (event) => {
        const selectTypeWaterObject = event.target.value;
        setSelectTypeWaterObject(selectTypeWaterObject);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { region, name_place, type_water_object, name_water_object, longitude, latitude, comment } = event.target;
        const { sampling_places } = this.state;
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
              errors.longitude = "error format, need form -90 to 90, characters after dote 6";
            }
          }
    
          if(!latitude.value|| !regexLatitude.test(latitude.value)){
            if(!latitude.value){
              errors.latitude ="fill coordinate y field";
            }
            else{
              errors.latitude ="error format, need form -180 to 180, characters after dote 6";
            }
          }
          

          const existingPlaceWithName = excludeSamplingPlaces.find(place => place.name_place == name_place.value);  
          if (existingPlaceWithName) {
            errors.place_match = "This name place is already taken"
          } 
    
          const existingPlaceWithCoordinates = excludeSamplingPlaces.find(place => place.longitude == longitude.value && place.latitude == latitude.value);
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
        } catch (error) {
            console.error('Error updating data:', error);
           
        }
    };


    return(
        <div class="edit-sampling-place">Change sampling place
          {}
            <form onSubmit={handleSubmit}>
                <h2>Region</h2>
                <select name="region" onChange={handleChangeRegion} value={selectRegion === '' ? sampling_place.region : selectRegion}>
                    {places.map(place => (
                        <option key={place._id} value={place.region}>{place.region}</option>
                    ))}
                </select>
                <h2>Name place</h2>
                <input type="text" name="name_place" value={sampling_place.name_place}/>
                <h2>Type water object</h2>
                <select name="type_water_object" onChange={handleChangeTypeWaterObject} value={selectTypeWaterObject === "" ? sampling_place.type_water_object : selectTypeWaterObject}>
                    <option value="lake">lake</option>
                    <option value="ocean">ocean</option>
                    <option value="reservoir">reservoir</option>
                    <option value="river">river</option>
                    <option value="sea">sea</option>
                </select>
                <h2>Name water object</h2>
                <input type="text" name="name_water_object" value={sampling_place.name_water_object}/>
                <h2>Longitude</h2>
                <input type="text" name="longitude" value={sampling_place.longitude}/>
                <h2>Latitude</h2>
                <input type="text" name="latitude" value={sampling_place.latitude}/>
                <h2>Comment</h2>
                <input type="text" name="comment" value={sampling_place.comment}/>
            </form>
        </div>
    );
}


export default EditSamplingPlace;