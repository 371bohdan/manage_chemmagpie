import React from "react";

import axios from 'axios';

import { Link } from 'react-router-dom';


class SearchChemicalIndexes extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            //databases
            places: [],
            samplingPlaces: [],
            chemical_indexes: [],

            //selected on panel managment
            selectedCountry: '',
            selectedRegion: '',
            selectedNamePlace: '',
            selectedDateFrom: '',
            selectedDateTo: '',

            //filters for database
            filterRegionsByCountry: [],
            filterRegionByRegion: [],
            filterRegionSamplingbyNamePlace: [],
            filterNamePlacesByRegion: [],
            filterNamePlaceIndex: [],
            filterNamePlacebyNamePlace: [],
            //За ним відбувається пошук потрібних даних
            filterSearch: [],


            //uniq value form database usses for filter
            uniqCountry: [],
            uniqRegionPlace: [],
            uniqRegionSampling: [],
            uniqNamePlaceSampling: [],
            uniqNamePlaceIndex: [],

            regime: false,
        }
    }

    componentDidMount(){
        this.fetchPlaces();
        this.fetchSamplingPlaces();
        this.fetchChemicalIndexes();
    }


    //Part for fetch
    fetchPlaces = async() => {
        try{
            const response = await axios.get('/api/places');
            const places = response.data;
            const uniqCountry = [...new Set(places.map(place => place.country))].sort((a, b) => a.localeCompare(b));
            const filterRegionsByCountry = places.filter(place => this.state.selectedCountry === "" ? place.country === uniqCountry[0] : place.country === this.state.selectedCountry);
            const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));
            console.log('uniqCountry:', uniqCountry);
            this.setState({ places: places, filterRegionsByCountry: filterRegionsByCountry, 
                uniqCountry: uniqCountry, uniqRegionPlace: uniqRegionPlace});
        }catch(err){
            console.log('Error fetching data from places', err)
        }
    }

    fetchSamplingPlaces = async() => {
        const response = await axios.get('/api/sampling_places');
        const sampling_places = response.data;


        //Зв'язати зовнішні ключі між places та sampling_places колекціями
        const filterRegionByRegion = sampling_places.filter(place => this.state.uniqRegionPlace.includes(place.region));
        const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));

        const filterRegionSamplingbyNamePlace = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0])
        const uniqNamePlaceSampling = [...new Set(filterRegionSamplingbyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

        this.setState({sampling_places: sampling_places,
                    uniqRegionSampling: uniqRegionSampling, uniqNamePlaceSampling: uniqNamePlaceSampling,
                    filterRegionByRegion: filterRegionByRegion, filterRegionSamplingbyNamePlace: filterRegionSamplingbyNamePlace
        })
    }

    fetchChemicalIndexes = async() => {
        const response = await axios.get('/api/chemical-index');
        const chemical_indexes = response.data;

        //Зв'язати зовнішні ключі між sampling_places та chemical_indexes колекціями
        const filterNamePlacebyNamePlace = chemical_indexes.filter(place => this.state.uniqNamePlaceSampling.includes(place.name_place));
        const uniqNamePlaceIndex = [...new Set(filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

        const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex);

        this.setState({chemical_indexes: chemical_indexes,
            filterNamePlacebyNamePlace: filterNamePlacebyNamePlace,
            filterSearch: filterSearch,
            uniqNamePlaceIndex: uniqNamePlaceIndex
        });
    }

    //Part for handle
    handleCountry= (event) => {
        try{
            const selectedCountry = event.target.value;

            this.setState({selectedCountry,
                selectedRegion: '',
                selectedNamePlace: '',
            })

            const {places, sampling_places, chemical_indexes} = this.state;

            const filterRegionsByCountry = places.filter(place => place.country === selectedCountry);
            const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));

            //Зв'язати зовнішні ключі між places та sampling_places колекціями
            const filterRegionByRegion = sampling_places.filter(place => uniqRegionPlace.includes(place.region));
            const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));
            console.log('uniqRegionSampling:', uniqRegionSampling)

            const filterRegionSamplingbyNamePlace = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0]);
            const uniqNamePlaceSampling = [...new Set(filterRegionSamplingbyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

            //Зв'язати зовнішні ключі між sampling_places та chemical_indexes колекціями
            const filterNamePlacebyNamePlace = chemical_indexes.filter(place => uniqNamePlaceSampling.includes(place.name_place));
            const uniqNamePlaceIndex = [...new Set(filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

            const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex);

            this.setState({filterRegionsByCountry: filterRegionsByCountry, filterRegionByRegion: filterRegionByRegion, 
                filterRegionSamplingbyNamePlace: filterRegionSamplingbyNamePlace, filterNamePlacebyNamePlace: filterNamePlacebyNamePlace,
                filterSearch: filterSearch,

                uniqRegionPlace: uniqRegionPlace, uniqRegionPlace: uniqRegionPlace,
                uniqRegionSampling: uniqRegionSampling,
                uniqNamePlaceSampling: uniqNamePlaceSampling, uniqNamePlaceIndex: uniqNamePlaceIndex
            })
        }catch(err){
            console.log('Error handle change country:', err)
        } 
    }

    handleRegion = (event) => {
        try{
            const {filterRegionByRegion, chemical_indexes} = this.state;

            const selectedRegion = event.target.value;
            this.setState({
                selectedRegion,
                selectedNamePlace: '',
            })

            const filterRegionSamplingbyNamePlace = filterRegionByRegion.filter(place => place.region === selectedRegion);
            const uniqNamePlaceSampling = [...new Set(filterRegionSamplingbyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));
    
            //Зв'язати зовнішні ключі між sampling_places та chemical_indexes колекціями
            const filterNamePlacebyNamePlace = chemical_indexes.filter(place => uniqNamePlaceSampling.includes(place.name_place));
            const uniqNamePlaceIndex = [...new Set(filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

            const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex);

            this.setState({filterRegionSamplingbyNamePlace: filterRegionSamplingbyNamePlace, filterNamePlacebyNamePlace: filterNamePlacebyNamePlace, 
                filterSearch: filterSearch,
                uniqNamePlaceSampling: uniqNamePlaceSampling, uniqNamePlaceIndex: uniqNamePlaceIndex, 
            });
    
        }catch(err){
            console.log('Error handle change region:', err)
        }
    }

    handleNamePalce = (event) => {
        try{
            const selectedNamePlace = event.target.value;
            const filterSearch = this.state.filterNamePlacebyNamePlace.filter(place => place.name_place === this.state.uniqNamePlaceIndex);
            this.setState({selectedNamePlace: selectedNamePlace,
                filterSearch: filterSearch})
        }catch(err){
            console.log('Error handle change name place:', err)
        }
    }

    handleDate = (event) => {
        try{
            const selectedDateFrom = event.target.value;
            const selectedDateTo = event.target.value;
            this.setState({selectedDateFrom, selectedDateTo});
            const {filterSearch} = this.state;
            const regexDate = /^(\d{2})\.(\d{2})\.(\d{4})$/;
            const dateAnalysis = filterSearch.map(place=> {
                    let matches = place.date_analysis.match(regexDate);
                    place.date_match = matches;
                    place.day = parseInt(matches[1], 10);
                    place.month = parseInt(matches[2], 10);
                    place.year = parseInt(matches[3], 10);
                    }
                )
            console.log('dateAnalysis:', dateAnalysis[0].day,  dateAnalysis[0].month, dateAnalysis[0].year)
            const transformDateFrom = selectedDateFrom.match(regexDate)
            const transformDateTo = selectedDateTo.match(regexDate);
            const newFilterSearch = dateAnalysis.filter(place => {
                if(regexDate.test(selectedDateFrom) && regexDate.test(selectedDateTo)){
                    if(place.year >= parseInt(transformDateFrom[3], 10) && place.year <= parseInt(transformDateTo[3], 10)){
                        if(place.month >= parseInt(transformDateFrom[2], 10) && place.month <= parseInt(transformDateTo[2], 10)){
                            if(place.day >= parseInt(transformDateFrom[1], 10) && place.day <= parseInt(transformDateTo[1], 10)){
                                place.day =''
                                place.month=''
                                place.year=''
                                place.date_match=''
                                return place;
                            }
                        }
                    }
                }
                else if(regexDate.test(selectedDateFrom) && !regexDate.test(selectedDateTo)){
                    if(place.year >= parseInt(transformDateFrom[3], 10)){
                        if(place.month >= parseInt(transformDateFrom[2], 10)){
                            if(place.day >= parseInt(transformDateFrom[1], 10)){
                                place.day =''
                                place.month=''
                                place.year=''
                                place.date_match=''
                                return place;
                            }
                        }
                    }
                }
                else if(!regexDate.test(selectedDateFrom) && regexDate.test(selectedDateTo)){
                    if(place.year <= parseInt(transformDateTo[3], 10)){
                        if(place.month <= parseInt(transformDateTo[2], 10)){
                            if(place.day <= parseInt(transformDateTo[1], 10)){
                                place.day =''
                                place.month=''
                                place.year=''
                                place.date_match=''
                                return place;
                            }
                        }
                    }
                }

            })
            this.setState({filterSearch: newFilterSearch, selectedDateFrom, selectedDateTo})
        }catch(err){
            console.log('Error handle change date analysis:', err)
        }
    }
    render(){
        const {selectedCountry, selectedRegion, selectedNamePlace, selectedDateFrom, selectedDateTo} = this.state;
        const {uniqCountry, uniqRegionSampling, uniqNamePlaceIndex} = this.state;
        return(
            <div>
                <h2>Search chemical index</h2>
                <div>
                    <p>Country</p>
                    <select name="country" value={selectedCountry} onChange={this.handleCountry}>
                        {uniqCountry.map(place => (
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                    <p>Region</p>
                    <select name="region" value={selectedRegion} onChange={this.handleRegion}>
                        {uniqRegionSampling.map(place => (
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                    <p>Name place</p>
                    <select name="region" value={selectedNamePlace} onChange={this.handleDate}></select>
                    <p>Date analysis from</p>
                    <input type="text" name="dateFrom" value={selectedDateFrom} onChange={this.handleDate}/>
                    <p>Date analysis to</p>
                    <input type="text" name="dateTo" value={selectedDateTo}/>
                </div>
                {/* {regime === true && (
                <div>
                    <p>Result found chemical index(es) for {place.country} and {sampling_places.region}</p>
                </div>
                )} */}
            </div>
        )
    }
}

export default SearchChemicalIndexes;