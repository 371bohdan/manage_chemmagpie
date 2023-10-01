import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';


function EditChemicalIndex(){
    const navigate = useNavigate(); 
    const {id} = useParams();

    const [places, setPlaces] = useState([]);
    const [sampling_places, setSamplingPlaces] = useState([]);
    const [chemical_indexes, setChemicalIndexes] = useState([]);
    //Для виключення за _id у випадку редагування збоїв перевірки унікальності за тим же _id(name_place, date_analysis, latitude)
    const [excludeChemicalIndexes, setExcludeChemicalIndexes] = useState([]);
    const [chemicalIndex, setChemicalIndex] = useState({
        name_place: '',
        chemical_index: '',
        result_chemical_index: '',
        date_analysis: '', 
        comment: ''
    });

    //select
    const [selectCountry, setSelectCountry] = useState('');
    const [selectRegion, setSelectRegion] = useState('');
    const [selectNamePlace, setSelectNamePlace] = useState('');

    const [selectChemicalIndex, setSelectChemicalIndex] = useState({});

    //unique
    const [uniqCountries, setUniqCountries] = useState([]);
    const [uniqRegions, setUniqRegions] = useState([]);
    const [uniqNamePlace, setUniqNamePlace] = useState([]);

    const [errors, setErrors] = useState([]);

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
        name: 'sulphates',
        abbr:'SO42-'
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

    useEffect(() => {
        fetchDownload();
    }, [])

    const fetchDownload = async () => {
        // places
        const responsePlaces = await axios.get('/api/places');
        const placesData = responsePlaces.data;
        setPlaces(placesData);
        

        //sampling_places
        const responseSamplingPlaces = await axios.get('/api/sampling_places');
        const samplingPlacesData = responseSamplingPlaces.data;
        setSamplingPlaces(samplingPlacesData);

        //chemical_index
        const responseChemicalIndex = await axios.get(`/api/edit-chemical-indexes/${id}`);
        const chemicalIndexData = responseChemicalIndex.data;
        setChemicalIndex(chemicalIndexData);

        //chemical_indexes
        const responseChemicalIndexes = await axios.get('/api/chemical-indexes');
        const chemicalIndexesData = responseChemicalIndexes.data;
        setChemicalIndexes(chemicalIndexesData)

        const excludeChemicalIndexes = chemicalIndexesData.filter(place => place._id !== id);
        setExcludeChemicalIndexes(excludeChemicalIndexes);

        fetchPlacesbySamplingPlacesbyChemicalIndexes(placesData, samplingPlacesData, chemicalIndexesData, chemicalIndexData);
    }

    const fetchPlacesbySamplingPlacesbyChemicalIndexes = async (places, sampling_places, chemical_indexes, chemical_index) => {
        //Для select
        const selectNamePlace = chemical_index.name_place;
        setSelectNamePlace(selectNamePlace);
        console.log('selectNamePlace', selectNamePlace)

        const filterNamePlaceByNamePlaceFirst = sampling_places.filter(place => chemical_index.name_place.includes(place.name_place));
        const uniqRegionFirst = [...new Set(filterNamePlaceByNamePlaceFirst.map(place => place.region))].sort((a, b) => a.localeCompare(b));
        const selectRegion = uniqRegionFirst[0];
        setSelectRegion(selectRegion);


        const filterRegionByRegionFirst = places.filter(place => uniqRegionFirst.includes(place.region));
        const uniqCountryFirst = [...new Set(filterRegionByRegionFirst.map(place => place.country))].sort((a, b) => a.localeCompare(b));
        const selectCountry = uniqCountryFirst[0];
        setSelectCountry(selectCountry);

        //Для списку option


        const uniqCountrySecond = [...new Set(places.map(place => place.country))].sort((a, b) => a.localeCompare(b));
        setUniqCountries(uniqCountrySecond);

        const filterRegionByCountry = places.filter(place => selectCountry === place.country);
        const uniqRegionsPlaces = [...new Set(filterRegionByCountry.map(place => place.region))].sort((a, b) => a.localeCompare(b));

        const filterRegionByRegionSecond = sampling_places.filter(place => uniqRegionsPlaces.includes(place.region));
        console.log('filterRegionByRegionSecond', filterRegionByRegionSecond)
        const uniqRegionSecond = [...new Set(filterRegionByRegionSecond.map(place => place.region))].sort((a, b) => a.localeCompare(b));
        setUniqRegions(uniqRegionSecond);

        const filterRegionByNamePlace = sampling_places.filter(place => selectRegion === place.region);
        const uniqNamePlaceSP = [...new Set(filterRegionByNamePlace.map(place => place.name_place))];

        const filterNamePlaceByNamePlace = chemical_indexes.filter(place => uniqNamePlaceSP.includes(place.name_place));
        const uniqNamePlaceSecond = [...new Set(filterNamePlaceByNamePlace.map(place => place.name_place))].sort((a, b) => a.localeCompare(b));
        setUniqNamePlace(uniqNamePlaceSecond);
        console.log('uniqNamePlaceSecond', uniqNamePlaceSecond)


        //Окремо для chemical index
        const selectChemicalIndex = indicators.find(element => element.abbr === chemical_index.chemical_index);
        setSelectChemicalIndex(selectChemicalIndex);
        console.log('selectChemicalIndex', selectChemicalIndex)

        
    }

    const handleChangeCountry = (event) => {
        const selectCountry = event.target.value;
        setSelectCountry(selectCountry);

        const filterRegionByCountry = places.filter(place => selectCountry === place.country);
        const uniqRegionsPlaces = [...new Set(filterRegionByCountry.map(place => place.region))].sort((a, b) => a.localeCompare(b));

        const filterRegionByRegion = sampling_places.filter(place => uniqRegionsPlaces.includes(place.region));
        const uniqRegionsSP = [...new Set(filterRegionByRegion.map(place => place.region))].sort((a, b) => a.localeCompare(b));
        setUniqRegions(uniqRegionsSP);
        setSelectRegion(uniqRegionsSP[0]);

        const filterRegionbyNamePlace = filterRegionByRegion.filter(place => uniqRegionsSP[0] === place.region);
        const uniqNamePlaceSP = [...new Set(filterRegionbyNamePlace.map(place => place.name_place))].sort((a, b) => a.localeCompare(b));

        const filterNamePlaceBynamePlace = chemical_indexes.filter(place => uniqNamePlaceSP.includes(place.name_place));
        const uniqNamePlaceSecond = [...new Set(filterNamePlaceBynamePlace.map(place => place.name_place))].sort((a, b) => a.localeCompare(b));

        setUniqNamePlace(uniqNamePlaceSecond);
        setSelectNamePlace(uniqNamePlaceSecond[0]);
        setChemicalIndex({...chemicalIndex, name_place: uniqNamePlaceSecond[0]})
    }

    const handleChangeRegion = (event) => {
        const selectRegion = event.target.value;
        setSelectRegion(selectRegion);

        const filterRegionbyNamePlace = sampling_places.filter(place => selectRegion === place.region);

        const uniqNamePlaceSP = [...new Set(filterRegionbyNamePlace.map(place => place.name_place))].sort((a, b) => a.localeCompare(b));
        const filterNamePlaceBynamePlace =  chemical_indexes.filter(place => uniqNamePlaceSP.includes(place.name_place))

        const uniqNamePlaceCI = [...new Set(filterNamePlaceBynamePlace.map(place => place.name_place))].sort((a, b) => a.localeCompare(b));
        
        setUniqNamePlace(uniqNamePlaceCI);
        setSelectNamePlace(uniqNamePlaceCI[0]);
        setChemicalIndex({...chemicalIndex, name_place: uniqNamePlaceCI[0]})
    }


    const changeNamePlace = (event) => {
        const selectNamePlace = event.target.value;
        setSelectNamePlace(selectNamePlace);
        setChemicalIndex({...chemicalIndex, name_place: event.target.value})
    }

    const changeChemicalIndex = (event) => {
      const selectedValue = event.target.value;
      const selectedChemicalIndex = indicators.find((indicator) => indicator.abbr === selectedValue);
      setSelectChemicalIndex(selectedChemicalIndex); // Оновлення selectChemicalIndex
      setChemicalIndex({
        ...chemicalIndex,
        chemical_index: selectedValue, // Оновлення хімічного показника в вашому стані
      });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name_place, chemical_index, result_chemical_index, date_analysis } = event.target;

        const errors = [];
        if(!name_place.value){
            errors.name_place = 'Fill field "name place"';
        }
        if(!chemical_index.value){
            errors.chemical_index = 'Fill field "chemical index"'
        }
        if(!result_chemical_index.value){
            errors.result_chemical_index = 'Fill field "result chemical index"';
        }
        
        const regexResultAnalysis = /^(\d+(\.\d{1,4})?)?$/;

        if(!regexResultAnalysis.test(result_chemical_index.value)){
            errors.result_chemical_index = 'Is not correct result analysis, must be for example 3, 30.1, 30.11, 30.123 or 30.2233 '
        }

        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const matches = date_analysis.value.match(dateRegex);

        if (matches && matches.length === 4) {
         if(matches) {
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
          errors.date_analysis = 'Invalid format date or empty field';
        }

        if (Object.keys(errors).length > 0) {
            // Відобразити повідомлення про помилки
            setErrors(errors);
            return;
        }
        try{
            const response = await axios.put(`/api/edit-chemical-indexes/${id}/update`, chemicalIndex);
            const updateChemicalIndex = response.data;
            console.log('Data updated:', updateChemicalIndex);
        }catch(err){
            console.log('Something wrong upon change data chemical_indexes:', err)
        }
    }
    return(
        <div>
            <h1>Change chemical index</h1>
            <div className='edit-chemical-index'>
                <h2>Country</h2>
                <select name="country" value={selectCountry} onChange={handleChangeCountry}>
                  {uniqCountries.map(country => (
                    <option value={country} key={country}>{country}</option>
                  ))}
                </select>
                <h2>Region</h2>
                <select name="region" value={selectRegion} onChange={handleChangeRegion}>
                    {uniqRegions.map(region => (
                      <option value={region} key={region}>{region}</option>
                    ))}
                </select>
                <form onSubmit={handleSubmit}>
                <h2>Name place</h2>
                <select name="name_place" value={selectNamePlace} onChange={changeNamePlace}>
                  {uniqNamePlace.map(name_place => (
                    <option value={name_place} key={name_place}>{name_place}</option>
                  ))}
                </select>
                <h2>Chemical index</h2>
                <select id="chemical_index" name="chemical_index" value={chemicalIndex.chemical_index} onChange={changeChemicalIndex}>
                    {indicators.map(indicator =>(
                        <option key={indicator.abbr} value={indicator.abbr}>{indicator.abbr}({indicator.name})</option>
                    ))}
                </select>
                <h2>Result chemical index</h2>
                <input name="result_chemical_index" value={chemicalIndex.result_chemical_index} onChange={(event) => (
                  setChemicalIndex({...chemicalIndex, 
                    result_chemical_index: event.target.value})
                )}/>
                {errors.result_chemical_index && <p className='error-edit-ci'>{errors.result_chemical_index}</p>}
                <h2>Date analysis</h2>
                <input name="date_analysis" value={chemicalIndex.date_analysis} onChange={(event) => (
                  setChemicalIndex({...chemicalIndex, date_analysis: event.target.value})
                )}/>
                {errors.date_analysis && <p className='error-edit-ci'>{errors.date_analysis}</p>}
                <h2>Comment</h2>
                <input name="comment" value={chemicalIndex.comment} onChange={(event) => (
                  setChemicalIndex({...chemicalIndex, comment: event.target.value})
                )}/>
                <input type="submit" value="Edit" />
                </form>
            </div>
        </div>
    )
}

export default EditChemicalIndex;