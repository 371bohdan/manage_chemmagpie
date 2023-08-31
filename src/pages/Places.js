import React, {useState, useEffect} from 'react'
import axios from 'axios'

class Places extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            places: []
        }
    }

    componentDidMount(){
        this.fetchPlaces();
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

    render(){
        const {places} = this.state;
        return(
            <div>
                <h1>List place data</h1>
                <ul>
                {places.map(place =>(
                    <li key={place._id}>{place.country}:{place.region}</li>
                ))}
                </ul>
            </div>
        )
    }
}

export default Places;
