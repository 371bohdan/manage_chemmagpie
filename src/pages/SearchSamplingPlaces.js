import React from "react";

import axios from 'axios';

import { Link } from 'react-router-dom';

class SearchSamplingPlaces extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedCountry: 'Ukraine',
            selectedRegion: '',
            selectedNameWaterObject: '',

            regime: false,

            places: [],
            sampling_places: [],

            filterRegionsByCountry:[],
            filterRegionByRegion: [],
            filterNWObyRegion: [],
            filterNWO:[],

            uniqCountry: [],
            uniqRegionPlace: [], 
            uniqRegionSampling: [],
            uniqNWO: [],
        }  
    }
    componentDidMount(){
        this.fetchPlaces();
        this.fetchSamplingPlaces();
    }

    fetchPlaces = async () => {
        try {
          const response = await axios.get('/api/places');
          const places = response.data;
          const uniqCountry = [...new Set(places.map(place => place.country))].sort((a, b) => a.localeCompare(b));
          const filterRegionsByCountry = places.filter(place => this.state.selectedCountry === "" ? place.country === uniqCountry[0] : place.country === this.state.selectedCountry);
          const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));
          console.log('filterRegions', filterRegionsByCountry)
          this.setState({ places: places, filterRegionsByCountry: filterRegionsByCountry, uniqCountry: uniqCountry, uniqRegionPlace: uniqRegionPlace});
          if(!this.state.selectedCountry){
            const selectedCountry = uniqCountry[0]
            this.setState({ selectedCountry: selectedCountry})
          }
        } catch (error) {
          console.error('Error fetching places:', error);
        }
      };

      fetchSamplingPlaces = async () => {
        try {
              const response = await axios.get('/api/sampling_places');
              const sampling_places = response.data;
    
              //Filter and connect for another two collections for concret country another word
              const filterRegionByRegion = sampling_places.filter(place => this.state.uniqRegionPlace.includes(place.region));
              const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));

              //Name water object
              const filterNWObyRegion = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0]);

              const uniqNWO = [...new Set(filterNWObyRegion.map(place => place.name_water_object))].sort((a, b) => a.localeCompare(b));

              const filterNWO = filterNWObyRegion.filter(place => uniqNWO[0].includes(place.name_water_object))
              this.setState({sampling_places, 
                uniqRegionSampling: uniqRegionSampling, uniqNWO: uniqNWO,
                filterRegionByRegion: filterRegionByRegion, filterNWO: filterNWO, filterNWObyRegion: filterNWObyRegion, 
              })
            } catch (error) {
              console.error('Error fetching sampling places:', error);
            }
          };
    
          searchData = () => {
            this.setState({regime: true});
          }

          backSearch = () => {
            this.setState({regime: false});
          }

          handleCountry = async(event) => {
            const selectedCountry = event.target.value;
            this.setState({
            selectedCountry: selectedCountry,
            selectedRegion: '',
            selectedNameWaterObject: '',})

            const places = this.state.places;

            //Part country
            const filterRegionsByCountry = places.filter(place => place.country === selectedCountry);
            const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));

            //Part region
            const filterRegionByRegion = this.state.sampling_places.filter(place => uniqRegionPlace.includes(place.region));
            const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));

            //Part name water object
            const filterNWObyRegion = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0]);
            const uniqNWO = [...new Set(filterNWObyRegion.map(place => place.name_water_object))].sort((a, b) => a.localeCompare(b));
            const filterNWO = filterNWObyRegion.filter(place => uniqNWO[0].includes(place.name_water_object));

            this.setState({
            uniqRegionPlace, uniqRegionSampling, uniqNWO,
            filterRegionsByCountry, filterRegionByRegion, filterNWObyRegion, filterNWO
            })
        }



            handleRegion = async(event) => {
                const selectedRegion = event.target.value;
                this.setState({
                    selectedRegion: selectedRegion,
                    selectedNameWaterObject: '',
                })

                //Part region
                const filterRegionByRegion = this.state.sampling_places.filter(place => this.state.uniqRegionPlace.includes(place.region));
                const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));
                //Part name water object
                const filterNWObyRegion = filterRegionByRegion.filter(place => place.region === selectedRegion);
                const uniqNWO = [...new Set(filterNWObyRegion.map(place => place.name_water_object))].sort((a, b) => a.localeCompare(b));
                const filterNWO = filterNWObyRegion.filter(place => uniqNWO[0].includes(place.name_water_object));

                this.setState({
                    uniqRegionSampling, uniqNWO,
                    filterRegionByRegion, filterNWObyRegion, filterNWO
                    })
            }



            handleNameWaterObject = async(event) => {
                const selectedNameWaterObject = event.target.value;
                this.setState({selectedNameWaterObject})
                //Part name water object
                const filterNWO = this.state.filterNWObyRegion.filter(place => place.name_water_object === selectedNameWaterObject);

                console.log("selectedNameWaterObject:", selectedNameWaterObject)

                this.setState({
                    filterNWO
                })
            }
          


            render() {
              const { filter_search, regime, selectedCountry, selectedRegion, selectedNameWaterObject } = this.state;
              const { uniqCountry, uniqRegionSampling, uniqNWO } = this.state;
              const { filterNWO } = this.state;
              return (
                  <div className="search_sampling_places">
                      <p>Search data sampling_places</p>
                      {regime === false &&
                      <div className="search-criterian-sp">
                          <div >
                              Country
                              <select name="country" value={selectedCountry} onChange={this.handleCountry}>
                                  {uniqCountry.map(place => (
                                      <option key={place} value={place}>{place}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              Region
                              <select name="region" value={selectedRegion} onChange={this.handleRegion}>
                                  {uniqRegionSampling.map(place => (
                                      <option key={place} value={place}>{place}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              Name water object
                              <select name="name_water_object" value={selectedNameWaterObject} onChange={this.handleNameWaterObject}>
                                  {uniqNWO.map(place => (
                                      <option key={place} value={place}>{place}</option>
                                  ))}
                              </select>
                          </div>
                          <button onClick={this.searchData}>Search</button>
                      </div>
                        }
                      {regime === true && (
                          <div className="result-search-sampling-place">
                            <div className="header-result-sp">
                              <p>Result search for country: {selectedCountry}</p>
                              <button onClick={this.backSearch}>Back</button>
                            </div>
                            <div className="th-result-sp">
                                <div>Id</div>
                                <div>Region</div>
                                <div>Longitude</div>
                                <div>Latitude</div>
                                <div>Name place</div>
                                <div>Name water object</div>
                                <div>Type water object</div>
                                <div>Comment</div>
                            </div>
                              {filterNWO.map((place, index) =>
                                  <div key={place._id} className="tr-result-sp">
                                      <div>{place._id}</div>
                                      <div>{place.region}</div>
                                      <div>{place.longitude}</div>
                                      <div>{place.latitude}</div>
                                      <div>{place.name_place}</div>
                                      <div>{place.name_water_object}</div>
                                      <div>{place.type_water_object}</div>
                                      <div>{place.comment}</div>
                                      <Link to={`/EditSamplingPlace/${place._id}`} className="edit-link">Edit</Link>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              );
          }
}

export default SearchSamplingPlaces;