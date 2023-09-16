import React from 'react'
import axios from 'axios'

class AddSamplingPlaces extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        places: [],
        sampling_places: [],
        selectedCountry: "Ukraine",
        successMessage: "",
        errorMessages: {},
    }
    //for reset
    this.formRef = React.createRef();
  }
  
    componentDidMount() {
      this.fetchPlaces();
      this.fetchSamplingPlaces();
    }

    
    fetchPlaces = async () => {
      try {
        const response = await axios.get('/api/places');
        const places = response.data;
        this.setState({ places });
      } catch (err) {
        console.log('Error fetching "places":', err);
      }
    }

    fetchSamplingPlaces = async () => {
     try {
      const response = await axios.get('/api/sampling_places');
      const sampling_places = response.data;
      this.setState({ sampling_places });
     } catch (err) {
      console.log('Error fetching "sampling_places":', err);
     }
    }
  

    handleCountryChange = (event) => {
      const selectedCountry = event.target.value;
      this.setState({ selectedCountry });
    }

    handleSubmit = async (event) => {
      event.preventDefault();

      // Перевірка на наявність пропущених рядків
      const { region, name_place, type_water_object, name_water_object, longitude, latitude, comment } = event.target;
      const { sampling_places } = this.state;
      const errors = {};


      if (!region.value) {
        errors.region = "fill in region field";
      }

      if(!name_place.value){
        errors.name_place = "fill in name place field";
      } else if(name_place.value){
        const existingPlaceWithName = sampling_places.find(place => place.name_place === name_place.value);     
        if (existingPlaceWithName) {
          errors.name_place = "This name place is already taken"
        } 
      }


      if(!type_water_object.value){
        errors.type_water_object = "fill in type water object field";
      }
      if(!name_water_object.value){
        errors.name_water_object = "fill in name water object field";
      }

      const regexLongitude = /^(-)?(([0-8]?[0-9])(\.\d{1,6})?)$|90$/
      const regexLatitude = /^(-)?((1?[0-7]?[0-9])(\.\d{1,6})?)$|180$/
  
      if(!longitude.value){
        errors.longitude = "fill coordinate x field";
      }else if(!regexLongitude.test(longitude.value)){
        errors.longitude = "error format, need form -90 to 90, characters after dote 6";
      }
      
      if(!latitude.value){
        errors.latitude ="fill coordinate y field";
      }else if(!regexLatitude.test(latitude.value)){
        errors.latitude = "error format, need form -180 to 180, characters after dote 6";
      }

      const existingPlaceWithCoordinates = sampling_places.find(place => place.longitude === longitude.value && place.latitude === latitude.value);
      if (existingPlaceWithCoordinates) {
        errors.coordinates_match =  "These coordinates are already taken";
      }

      if (Object.keys(errors).length > 0) {
        // Відобразити повідомлення про помилки
        this.setState({ successMessage: "", errorMessages: errors });
        return;
      }

  try {
    const response = await axios.post('/api/add-sampling-place', {
      region: region.value,
      name_place: name_place.value,
      type_water_object: type_water_object.value,
      name_water_object: name_water_object.value,
      longitude: longitude.value,
      latitude: latitude.value,
      comment: comment.value
    });

    // Відобразити повідомлення про успішне збереження
    this.setState({ successMessage: response.data.message, errorMessages: {} });
    // Reset the form
    this.formRef.current.reset();
  } catch (error) {
    // Відобразити повідомлення про помилку
    this.setState({ successMessage: "", errorMessages: { general: "Failed to save sampling place." } });
  }
}
  
    render() {
      const { places, selectedCountry, errorMessages } = this.state;
      const filteredPlaces = places.filter(place => place.country === selectedCountry);
      const uniqueCountries = [...new Set(places.map(place => place.country))];
      const {region, name_place, name_water_object, longitude, latitude, coordinates_match} = errorMessages

      return (<div>
        <h1>Add sampling place</h1>
        {this.state.successMessage && <div className="success">{this.state.successMessage}</div>}
        <div className='add_sampling_places'>
              <h1>Country</h1>
              <select id="country" name="country" onChange={this.handleCountryChange} defaultValue={this.state.selectedCountry}>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
                <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <h1>Region</h1>
                <select id="region" name='region'>
                    {filteredPlaces.map(place => (
                        <option key={place._id} value={place.region}>{place.region}</option>
                    ))}
                </select>
                {region && <div>{region}</div>}
                <h1>Name place</h1>
                <input type="text" name="name_place" />
                {name_place && <div className='errors_sp'><p>{name_place}</p></div>}
                <h1>Type water object</h1>
                <select name="type_water_object">
                    <option value="lake">lake</option>
                    <option value="ocean">ocean</option>
                    <option value="reservoir">reservoir</option>
                    <option value="river">river</option>
                    <option value="sea">sea</option>
                </select>
                <h1>Name water object</h1>
                <input type="text" name="name_water_object" />
                {name_water_object && <div className="errors_sp"><p>{name_water_object}</p></div>}
                <h1>Longitude</h1>
                <input type="text" name="longitude" placeholder='example: 33.00111' />
                {longitude && <div className='errors_sp'><p>{longitude}</p></div>}
                {coordinates_match && <div className='errors_sp'><p>{coordinates_match}</p></div>}
                <h1>Latitude</h1>
                <input type="text" name="latitude" placeholder='example: 33.00111' />
                {latitude && <div className='errors_sp' ><p>{latitude}</p></div>}
                {coordinates_match && <div className='errors_sp' ><p>{latitude}</p></div>}
                <h1>Comment</h1>
                <input type="text" name="comment" />
                <input type="submit" value="Send" />
                </form>
            </div>
            </div>
      )}
}
  
  export default AddSamplingPlaces;
  
  
  