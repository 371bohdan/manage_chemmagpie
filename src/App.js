import {BrowserRouter, Routes, Route, Link, NavLink, createRoutesFromElements, createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootLayout from './layouts/RootLayout';


import Home from './pages/Home';
import About from './pages/About';

import AddSamplingPlaces from './pages/AddSamplingPlaces';
import AddChemicalIndex from './pages/AddChemicalIndex';
import SearchSamplingPlaces from './pages/SearchSamplingPlaces';
import EditSamplingPlace from './pages/EditSamplingPlace';
import SearchChemicalIndexes from './pages/SearchChemicalIndexes';
import EditChemicalIndex from './pages/EditChemicalIndex';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path="addSamplingPlace" element={<AddSamplingPlaces />}/>
        <Route path="addChemicalIndex" element={<AddChemicalIndex/>} />
        <Route path="searchSamplingPlaces" element={<SearchSamplingPlaces/>} />
        <Route path="searchChemicalIndexes" element={<SearchChemicalIndexes/>} />
        <Route path="editSamplingPlace/:id" element={<EditSamplingPlace/>} />
        <Route path="editChemicalIndex/:id" element={<EditChemicalIndex/>} />
        <Route path='about' element={<About />}/>
    </Route>
  )
) 




function App(){
  return(
    <RouterProvider router={router} />
  )
}

export default App;











