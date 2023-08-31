import React from 'react';
import axios from 'axios';

class AddChemicalIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      sampling_places: [],
      selectedCountry: "Ukraine",
      selectedRegion: '',
      selectedTypeWaterObject: '',
      selectedNameWaterObject: '',
      selectedNamePlace: '',

      uniqCountry: [],
      uniqRegionPlace: [],
      uniqRegionSampling: [],
      uniqTypeWaterObject:[],
      uniqNameWaterObject:[],
      uniqNamePlace: [],

      filterRegionsByCountry:[],
      filterRegionByRegion: [],
      filterTWOByRegion: [],
      filterNWOByTWO: [],
      filterNPByNWO: [],
      
      successMessage: "",
      errorMessages: {},
    };
  }

  componentDidMount() { 
    this.fetchPlaces();
    this.fetchSamlingPlaces();   
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
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  fetchSamlingPlaces = async () => {
    try {
          const response = await axios.get('/api/sampling_places');
          const sampling_places = response.data;

          //Filter and connect for another two collections for concret country another word
          const filterRegionByRegion = sampling_places.filter(place => this.state.uniqRegionPlace.includes(place.region));
          const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));
          
          //Type water object
          const filterTWOByRegion = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0]);

          const uniqTypeWaterObject = [...new Set(filterTWOByRegion.map(place => place.type_water_object))].sort((a,b) => a.localeCompare(b));

          //Name water object
          const filterNWOByTWO = filterTWOByRegion.filter(place => place.type_water_object === uniqTypeWaterObject[0]);

          const uniqNameWaterObject = [...new Set(filterNWOByTWO.map(place => place.name_water_object))].sort((a,b) => a.localeCompare(b));

          //Name place
          const filterNPByNWO = filterNWOByTWO.filter(place => place.name_water_object === uniqNameWaterObject[0]);
          console.log('filterNPbyNWO:',filterNPByNWO)

          const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));
          console.log('uniqNamePlace:',uniqNamePlace)
          this.setState({sampling_places, uniqRegionSampling: uniqRegionSampling, uniqTypeWaterObject: uniqTypeWaterObject, 
            uniqNameWaterObject: uniqNameWaterObject, uniqNamePlace: uniqNamePlace,
            filterTWOByRegion: filterTWOByRegion, filterNWOByTWO: filterNWOByTWO, filterNPByNWO: filterNPByNWO
          })
            
        } catch (error) {
          console.error('Error fetching sampling places:', error);
        }
      };


      handleChangeCountry = async (event) => {
        try{
        const selectedCountry = event.target.value;
        this.setState({ 
        selectedCountry: selectedCountry, 
        selectedRegion: "",
        selectedTypeWaterObject: "",
        selectedNameWaterObject: "",
        selectedNamePlace: "",
        });
        const places = this.state.places;
        const filterRegionsByCountry = places.filter(place => place.country === selectedCountry);
        const uniqRegionPlace = [...new Set(filterRegionsByCountry.map(place => place.region))].sort((a,b) => a.localeCompare(b));

        const sampling_places = this.state.sampling_places;
        const filterRegionByRegion = sampling_places.filter(place => uniqRegionPlace.includes(place.region));
        const uniqRegionSampling = [...new Set(filterRegionByRegion.map(place=>place.region))].sort((a,b) => a.localeCompare(b));
        console.log("handleChangeCountry, uniqRegionSampling", uniqRegionSampling);

        const filterTWOByRegion = filterRegionByRegion.filter(place => place.region === uniqRegionSampling[0]);
        const uniqTypeWaterObject = [...new Set(filterTWOByRegion.map(place => place.type_water_object))].sort((a,b) => a.localeCompare(b));

        const filterNWOByTWO = filterTWOByRegion.filter(place => place.type_water_object === uniqTypeWaterObject[0]);
        const uniqNameWaterObject = [...new Set(filterNWOByTWO.map(place => place.name_water_object))].sort((a,b) => a.localeCompare(b));

        const filterNPByNWO = filterNWOByTWO.filter(place => place.name_water_object === uniqNameWaterObject[0]);
        const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));

        this.setState({uniqRegionPlace: uniqRegionPlace, uniqRegionSampling: uniqRegionSampling, uniqTypeWaterObject: uniqTypeWaterObject, 
          uniqNameWaterObject: uniqNameWaterObject, uniqNamePlace: uniqNamePlace,
          filterTWOByRegion: filterTWOByRegion, filterNWOByTWO: filterNWOByTWO, filterNPByNWO: filterNPByNWO
        })
        }catch(err){
          console.log('Error method handleChangeCountry:', err);
        }
      };


      handleChangeRegion = (event) => {
        const selectedRegion = event.target.value;
        this.setState({ 
        selectedRegion: selectedRegion, 
        selectedTypeWaterObject: "",
        selectedNameWaterObject: "",
        selectedNamePlace: ""});

        const sampling_places = this.state.sampling_places;
        const filterRegionByRegion = sampling_places.filter(place => selectedRegion.includes(place.region));
        console.log('handleChangeRegion, filterRegionByRegion', filterRegionByRegion)
        
        const filterTWOByRegion = filterRegionByRegion.filter(place => place.region === selectedRegion);
        console.log('handleChangeRegion, filterTWOByRegion', filterTWOByRegion)
        const uniqTypeWaterObject = [...new Set(filterTWOByRegion.map(place => place.type_water_object))].sort((a,b) => a.localeCompare(b));

        const filterNWOByTWO = filterTWOByRegion.filter(place => place.type_water_object === uniqTypeWaterObject[0]);
        console.log('handleChangeRegion, filterTWOByRegion', filterTWOByRegion)
        const uniqNameWaterObject = [...new Set(filterNWOByTWO.map(place => place.name_water_object))].sort((a,b) => a.localeCompare(b));

        const filterNPByNWO = filterNWOByTWO.filter(place => place.name_water_object === uniqNameWaterObject[0]);
        const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));

        this.setState({uniqTypeWaterObject: uniqTypeWaterObject, 
          uniqNameWaterObject: uniqNameWaterObject, uniqNamePlace: uniqNamePlace,
          filterTWOByRegion: filterTWOByRegion, filterNWOByTWO: filterNWOByTWO, filterNPByNWO: filterNPByNWO
        })
      };
      
      handleChangeTypeWaterObject = (event) => {
        const selectedTypeWaterObject = event.target.value;
        this.setState({ 
          selectedTypeWaterObject: selectedTypeWaterObject,
          selectedNameWaterObject: "",
          selectedNamePlace: "",
        });
    
        const filterNWOByTWO = this.state.filterTWOByRegion.filter(place => place.type_water_object === selectedTypeWaterObject);
        console.log('handleChangeTypeWaterObject filterNWOByTWO', filterNWOByTWO);
        const uniqNameWaterObject = [...new Set(filterNWOByTWO.map(place => place.name_water_object))].sort((a,b) => a.localeCompare(b));
      
        const filterNPByNWO = filterNWOByTWO.filter(place => place.name_water_object === uniqNameWaterObject[0]);
        const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));

        this.setState({uniqNameWaterObject: uniqNameWaterObject, uniqNamePlace: uniqNamePlace,
                      filterNWOByTWO: filterNWOByTWO, filterNPByNWO: filterNPByNWO})
      };
      

      handleChangeNameWaterObject = (event) => {
        const selectedNameWaterObject = event.target.value;
        this.setState({ selectedNameWaterObject: selectedNameWaterObject,
          selectedNamePlace: ""});
          const filterNPByNWO = this.state.filterNWOByTWO.filter(place => place.name_water_object === selectedNameWaterObject);
          const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));
  
          this.setState({ uniqNamePlace: uniqNamePlace,
                        filterNPByNWO: filterNPByNWO})
      };
      
      handleChangeNamePlace = (event) => {
         const selectedNamePlace = event.target.value;
         this.setState({ selectedNamePlace: selectedNamePlace });
      };

      handleSubmit = async (event) => {
        event.preventDefault();

        const { name_place, chemical_index, result_chemical_index, date_analysis, comment} = event.target;
        const errors = {};
        const regexDateNalysis = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(199[7-9]|20[01][0-9]|202[0-3])$/
        const regexResultAnalysis = /\d\.\d{1,4}/

        if(!name_place.value){
          errors.name_place = 'Empty field "name place"'
          console.log('Empty field "name place"');
        }
        if(!chemical_index.value){
          errors.chemical_index = 'Empty field "chemical index"'
          console.log('Empty field "chemical index"');
        }
        if(!result_chemical_index.value || !regexResultAnalysis.test(result_chemical_index.value)){
          if(!result_chemical_index.value){
            errors.result_chemical_index = 'Empty filed "result chemical index"'
          }
          else{
            errors.result_chemical_index = 'Is not correct result analysis, must be for example "30.1, 30.11, 30.123 or 30.2233 '
          }
        }

        if(!date_analysis.value || !regexDateNalysis.test(date_analysis.value)){
          if(!date_analysis.value){
            errors.date_analysis = 'Empty field "date analysis"'
          }
          else{
            errors.date_analysis = 'Is not correct date analysis must be "from 01.01.1997 to today"'
          }
        }
        if (Object.keys(errors).length > 0) {
          // Відобразити повідомлення про помилки
          this.setState({ successMessage: "", errorMessages: errors });
          return;
        }
        try{
            const response = await axios.post('/api/add-chemical-index', {
              name_place: name_place.value,
              chemical_index: chemical_index.value,
              result_chemical_index: result_chemical_index.value,
              date_analysis: date_analysis.value,
              comment: comment.value
            });
          this.setState({ successMessage: response.data.message, errorMessages: {} });
        }catch(err){
          console.log('handleSubmit:', err)
        }
      }

  render(){
    const {
      selectedCountry,
      selectedRegion,
      selectedTypeWaterObject,
      selectedNameWaterObject,
      selectedNamePlace,

      uniqCountry,
      uniqRegionSampling,
      uniqTypeWaterObject,
      uniqNameWaterObject,
      uniqNamePlace,

      errorMessages
    } = this.state;

    const {result_chemical_index, date_analysis} = errorMessages;

    const indicators = [{
      name: 'nitrates',
      abbr: 'NO3-'
    },
    {
      name: 'chlorides',
      abbr:'Cl-'
    },
    {
      name: 'nitrites',
      abbr:'NO2-'
    },
    {
      name: 'phosphates',
      abbr:'PO43-'
    },
    {
      name: 'total hardness',
      abbr:'TH'
    },
    {
      name: 'chemical oxygen consumption',
      abbr:'COC'
    },
    {
      name: 'fluorides',
      abbr:'F-'
    }]


    return (
      <div>
        <h1>Add chemical index</h1>
        {this.state.successMessage && <div className="success">{this.state.successMessage}</div>}
        <div className='add_chemical_indexes'>
          <h1>Country</h1>
          <select id="country" name="country" onChange={this.handleChangeCountry} value={selectedCountry}>
            {uniqCountry.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>

          <h1>Region</h1>
          <select id="region" name="region" onChange={this.handleChangeRegion} value={selectedRegion}>
            {uniqRegionSampling.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <h1>Type water object</h1>
          <select id="type_water_object" name='type_water_object' onChange={this.handleChangeTypeWaterObject} value={selectedTypeWaterObject}>
          {uniqTypeWaterObject.map(type_water_object => (
            <option key={type_water_object} value={type_water_object}>{type_water_object}</option>
          ))}
          </select>

          <h1>Name water object</h1>
          <select id="name_water_object" name="name_water_object" onChange={this.handleChangeNameWaterObject} value={selectedNameWaterObject}>
            {uniqNameWaterObject.map(name_water_object => (
              <option key={name_water_object} value={name_water_object}>{name_water_object}</option>
            ))}
           </select>
            <form onSubmit={this.handleSubmit} >

              <h1>Name place</h1>
              <select id="name_place" name="name_place" onChange={this.handleChangeNamePlace} value={selectedNamePlace}>
                {uniqNamePlace.map(name_place => (
                  <option key={name_place} value={name_place}>{name_place}</option>
                ))}
              </select>

              <h1>Chemical index</h1>
              <select id="chemical_index" name="chemical_index" >
                  {indicators.map(indicator =>(
                    <option key={indicator.name} value={indicator.abbr}>{indicator.abbr}({indicator.name})</option>
                  ))}
              </select>

              <h1>Result chemical index</h1>
              {result_chemical_index ? 
                (<div className='errors'><input  type='text' name='result_chemical_index'/><p>{result_chemical_index}</p></div>):
                (<input type='text' name='result_chemical_index'/>)
              }

              <h1>Date analysis</h1>
              {date_analysis ? (<div className='errors'><input type='text' name="date_analysis"/><p>{date_analysis}</p></div>):
              (<input type="text" name="date_analysis" />)
              }
              <h1>Comment</h1>
                <input type="text" name="comment" />
              <input type="submit" value="Send" />
            </form>  
        </div>
      </div>
    )
  }
}

export default AddChemicalIndex;
