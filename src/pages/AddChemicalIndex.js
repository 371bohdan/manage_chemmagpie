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

          const uniqNamePlace = [...new Set(filterNPByNWO.map(place => place.name_place))].sort((a,b) => a.localeCompare(b));
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
        const regexResultAnalysis = /^(\d+(\.\d{1,4})?)?$/;

        if(!result_chemical_index.value || !regexResultAnalysis.test(result_chemical_index.value)){
          if(!result_chemical_index.value){
            errors.result_chemical_index = 'Empty filed "result chemical index"'
          }
          else{
            errors.result_chemical_index = 'Is not correct result analysis, must be for example 3, 30.1, 30.11, 30.123 or 30.2233 '
          }
        }

        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const matches = date_analysis.value.match(dateRegex);

        if (!date_analysis.value || (matches && matches.length === 4)) {
          if (!date_analysis.value) {
            errors.date_analysis = 'Empty field "date analysis"';
          } else if(matches) {
            const day = parseInt(matches[1], 10);
            const month = parseInt(matches[2], 10);
            const year = parseInt(matches[3], 10);
            // Перевірка валідності дати
            if (month >= 1 && month <= 12) {
              const maxDaysInMonth = new Date(year, month, 0).getDate();
              if (day >= 1 && day <= maxDaysInMonth) {
                // Перевірка на високосний рік
                const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                if (month === 2 && day > 29 && !isLeapYear) {
                  errors.date_analysis = 'Invalid date: February cannot have more than 29 days in a non-leap year.';
                } else {
                  // Перевірка на дату, яка не перевищує сьогоднішню дату
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Встановити час на початок дня
                  const enteredDate = new Date(year, month - 1, day); // month - 1, оскільки місяці в Date починаються з 0
                  if (enteredDate > currentDate) {
                    errors.date_analysis = 'Invalid date: The date cannot be in the future.';
                  }
                }
              } else {
                errors.date_analysis = 'Invalid date: The day exceeds the maximum number of days in the month.';
              }
            } else {
              errors.date_analysis = 'Invalid date: The month must be in the range 1 to 12.';
            }
          }
        } else {
          errors.date_analysis = 'Invalid format date';
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
      abbr: 'NO3-',
      real: 'NO₃¯',
      metters: 'mg/dm³',
    },
    {
      name: 'chlorides',
      abbr:'Cl-',
      real: 'Cl¯',
      metters: 'mg/dm³',
    },
    {
      name: 'nitrites',
      abbr:'NO2-',
      real: 'NO₂¯',
      metters: 'mg/dm³',
    },
    {
      name: 'phosphates',
      abbr:'PO43-',
      real:'PO₄³¯',
      metters: 'mg/dm³',
    },
    {
      name: 'sulphates',
      abbr:'SO42-',
      real: 'SO₄²¯',
      metters: 'mg/dm³',
    },
    {
      name: 'total hardness',
      abbr:'TH',
      real: 'TH',
      metters: 'mmol/dm³',
    },
    {
      name: 'chemical oxygen consumption',
      abbr:'COC',
      real: 'COC',
      metters: 'mg/dm³',
    },
    {
      name: 'fluorides',
      abbr:'F-',
      real:'F¯',
      metters: 'mg/dm³',
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
                    <option key={indicator.name} value={indicator.abbr}>{indicator.real}({indicator.name})</option>
                  ))}
              </select>

              <h1>Result chemical index</h1>
              <h1>in mg/dm³(for TW mmol/dm³)</h1>
              <input type='text' name="result_chemical_index"/>
              {result_chemical_index &&  <div className='errors'><p className='errors'>{result_chemical_index}</p></div>}

              <h1>Date analysis</h1>
              <input type='text' name="date_analysis"/>
              {date_analysis &&  <div className='errors'><p className='errors'>{date_analysis}</p></div>}
              
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
