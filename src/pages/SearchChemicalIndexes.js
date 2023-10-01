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
            selectedCountry: 'Ukraine',
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

            errorMessageDate: '',
        }
    }

    async componentDidMount(){
        await this.fetchPlaces();
        await this.fetchSamplingPlaces();
        await this.fetchChemicalIndexes();
    }


    //Part for fetch
    fetchPlaces = async () => {
        try{
            const response = await axios.get('/api/places');
            const places = response.data;
            const uniqCountry = [...new Set(places.map(place => place.country))].sort((a, b) => a.localeCompare(b));
            const filterRegionsByCountry = places.filter(place => this.state.selectedCountry === "" ? place.country === uniqCountry[0] : place.country === this.state.selectedCountry);
            const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));
            this.setState({ places: places, filterRegionsByCountry: filterRegionsByCountry, 
                uniqCountry: uniqCountry, uniqRegionPlace: uniqRegionPlace});
            if(!this.state.selectedCountry){
                const selectedCountry = uniqCountry[0]
                this.setState({ selectedCountry: selectedCountry})
            }
        }catch(err){
            console.log('Error fetching data from places', err)
        }
    }

    fetchSamplingPlaces = async () => {
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
        console.log('uniqNamePlaceSampling', uniqNamePlaceSampling);
        if(!this.state.selectedRegion){
            const selectedRegion = uniqRegionSampling[0]
            this.setState({ selectedRegion: selectedRegion})
        }
    }

    fetchChemicalIndexes = async () => {
        const response = await axios.get('/api/chemical-indexes');
        const chemical_indexes = response.data;
        const uniqNamePlaceSampling = this.state.uniqNamePlaceSampling
        console.log(uniqNamePlaceSampling)

        //Зв'язати зовнішні ключі між sampling_places та chemical_indexes колекціями
        const filterNamePlacebyNamePlace = chemical_indexes.filter(place => uniqNamePlaceSampling.includes(place.name_place));
        const uniqNamePlaceIndex = [...new Set(filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));
        console.log('uniqNamePlaceIndex', uniqNamePlaceIndex);
        console.log('uniqNamePlaceIndex:', uniqNamePlaceIndex)
        const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex[0]);

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

            this.setState({
                selectedCountry,
                selectedRegion: '',
                selectedNamePlace: '',
                selectedDateFrom: '',
                selectedDateTo: '',
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

            const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex[0]);

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
                selectedDateFrom: '',
                selectedDateTo: '',
            })

            const filterRegionSamplingbyNamePlace = filterRegionByRegion.filter(place => place.region === selectedRegion);
            const uniqNamePlaceSampling = [...new Set(filterRegionSamplingbyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));
    
            //Зв'язати зовнішні ключі між sampling_places та chemical_indexes колекціями
            const filterNamePlacebyNamePlace = chemical_indexes.filter(place => uniqNamePlaceSampling.includes(place.name_place));
            const uniqNamePlaceIndex = [...new Set(filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));

            const filterSearch = filterNamePlacebyNamePlace.filter(place => place.name_place === uniqNamePlaceIndex[0]);

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
            this.setState({ selectedNamePlace: selectedNamePlace,
                selectedDateFrom: '',
                selectedDateTo: '',
            })
            const uniqNamePlaceIndex = [...new Set(this.state.filterNamePlacebyNamePlace.map(place=>place.name_place))].sort((a, b) => a.localeCompare(b));
            const filterSearch = this.state.filterNamePlacebyNamePlace.filter(place => place.name_place === selectedNamePlace);
            this.setState({ uniqNamePlaceIndex: uniqNamePlaceIndex,
                filterSearch: filterSearch})
        }catch(err){
            console.log('Error handle change name place:', err)
        }
    }


    handleDateFrom = (event) => {
        try {
            const selectedDateFrom = event.target.value;
            this.setState({ selectedDateFrom: selectedDateFrom });
        } catch (err) {
            console.log("Error change date from", err);
        }
    }
    
    handleDateTo = (event) => {
        try {
            const selectedDateTo = event.target.value;
            this.setState({ selectedDateTo: selectedDateTo });
        } catch (err) {
            console.log("Error change date to", err);
        }
    }

    handleDate = () => {
        try {
            const { selectedDateFrom, selectedDateTo } = this.state;
            const oldFilterSearch = this.state.filterNamePlacebyNamePlace.filter((place) =>
                this.state.selectedNamePlace === ""
                    ? place.name_place === this.state.uniqNamePlaceIndex[0]
                    : place.name_place === this.state.selectedNamePlace
            );
    
            const regexDate = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    
            const newFilterSearch = oldFilterSearch.filter((place) => {
                const transformDate_Analysis = place.date_analysis.match(regexDate);
                console.log('transformDate_Analysis:', transformDate_Analysis)
                const date_analysisDay = parseInt(transformDate_Analysis[1], 10);
                const date_analysisMonth = parseInt(transformDate_Analysis[2], 10);
                const date_analysisYear = parseInt(transformDate_Analysis[3], 10);
    
                let transformDateFrom;
                let fromDay;
                let fromMonth;
                let fromYear;
    
                let transformDateTo;
                let toDay;
                let toMonth;
                let toYear;
    
                if (regexDate.test(selectedDateFrom) || regexDate.test(selectedDateTo)) {
                    if (regexDate.test(selectedDateFrom)) {
                        transformDateFrom = selectedDateFrom.match(regexDate);
                        fromDay = parseInt(transformDateFrom[1], 10);
                        fromMonth = parseInt(transformDateFrom[2], 10);
                        fromYear = parseInt(transformDateFrom[3], 10);
                    }
    
                    if (regexDate.test(selectedDateTo)) {
                        transformDateTo = selectedDateTo.match(regexDate);
                        toDay = parseInt(transformDateTo[1], 10);
                        toMonth = parseInt(transformDateTo[2], 10);
                        toYear = parseInt(transformDateTo[3], 10);
                    }
    
                    if (regexDate.test(selectedDateFrom) && regexDate.test(selectedDateTo)) {
                        if (fromYear <= date_analysisYear && date_analysisYear <= toYear) {
                            if (fromYear < date_analysisYear || (fromYear === date_analysisYear && fromMonth <= date_analysisMonth && date_analysisMonth <= toMonth)) {
                                if (fromYear < date_analysisYear || (fromYear === date_analysisYear && fromMonth === date_analysisMonth && fromDay <= date_analysisDay && date_analysisDay <= toDay)) {
                                    return true;
                                }
                            }
                        }
                    } else if (regexDate.test(selectedDateFrom) && selectedDateTo === "") {
                        if (fromYear <= date_analysisYear) {
                            if (fromYear < date_analysisYear || (fromYear === date_analysisYear && fromMonth <= date_analysisMonth)) {
                                if (fromYear < date_analysisYear || (fromYear === date_analysisYear && fromMonth === date_analysisMonth && fromDay <= date_analysisDay)) {
                                    return true;
                                }
                            }
                        }
                    } else if (selectedDateFrom === "" && regexDate.test(selectedDateTo)) {
                        if (date_analysisYear <= toYear) {
                            if (date_analysisYear < toYear || (date_analysisYear === toYear && date_analysisMonth <= toMonth)) {
                                if (date_analysisYear < toYear || (date_analysisYear === toYear && date_analysisMonth === toMonth && date_analysisDay <= toDay)) {
                                    return true;
                                }
                            }
                        }
                    }
                } else if (selectedDateFrom === "" && selectedDateTo === "") {
                    return true;
                }
                return false;
            });
            console.log('newFilterSearch:', newFilterSearch)
            this.setState({ filterSearch: newFilterSearch });
        } catch (err) {
            console.log('Error handle change date analysis:', err);
        }
    };

    handleRegimeON = () => {
        this.setState({regime: true})
    }
    handleRegimeOFF = () => {
        this.setState({regime: false})
    }

    render(){
        const {selectedCountry, selectedRegion, selectedNamePlace, selectedDateFrom, selectedDateTo} = this.state;
        const {uniqCountry, uniqRegionSampling, uniqNamePlaceIndex} = this.state;
        const {filterSearch, regime} = this.state;
        return(
            <div>
                <h2>Search chemical index</h2>
                {regime === false &&        
                <div className="searchChI">
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
                    <select name="region" value={selectedNamePlace} onChange={this.handleNamePalce}>
                        {uniqNamePlaceIndex.map(place => (
                            <option key={place} value={place}>{place}</option>
                        )
                        )}
                    </select>
                    <p>Date analysis from</p>
                    <input type="text" name="dateFrom" value={selectedDateFrom} onChange={this.handleDateFrom} onBlur={this.handleDate}/>
                    <p>Date analysis to</p>
                    <input type="text" name="dateTo" value={selectedDateTo} onChange={this.handleDateTo} onBlur={this.handleDate}/>
                    <button onClick={this.handleRegimeON}>show results</button>
                </div>
                }
                {regime === true && (
                <div className="result-search-chemical-indexes">
                    <div className="head-result-search-chemical-indexes">
                        <p>Result search for country: {selectedCountry} on region {selectedRegion}</p>
                        <button onClick={this.handleRegimeOFF}>Back</button>
                </div>
                    <div className="th-result-chi">
                        <div>_id</div>
                        <div>name place</div>
                        <div>chemical index</div>
                        <div>result chemical index</div>
                        <div>date analysis</div>
                        <div>comment</div>
                        <div></div>
                    </div>
                    {filterSearch.map(place =>(
                    <div className='tr-result-chi' key={place._id}>
                        <div key={place._id} value={place._id}>{place._id}</div>
                        <div key={place._id} value={place.name_place}>{place.name_place}</div>
                        <div key={place._id} value={place.chemical_index}>{place.chemical_index}</div>
                        <div key={place._id} value={place.result_chemical_index}>{place.result_chemical_index}</div>
                        <div key={place._id} value={place.date_analysis}>{place.date_analysis}</div>
                        <div key={place._id} value={place.comment}>{place.comment}</div>
                        <Link to={`/EditChemicalIndex/${place._id}`} className="edit-link">Edit</Link>
                    </div>
                    ))}
                </div>
                )}


            </div>
        )
    }
}

export default SearchChemicalIndexes;