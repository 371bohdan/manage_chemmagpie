import { NavLink, Outlet } from 'react-router-dom';


const RootLayout = () => {
    return (
        <div className='root-layout'>
            <header>
            <nav>
            <h1>Chemmagpie</h1>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='about'>About</NavLink>
            <NavLink to='addSamplingPlace'>Add sampling place</NavLink>
            <NavLink to='addChemicalIndex'>Add chemical Index</NavLink>
            <NavLink to='searchSamplingPlaces'>Search sampling places</NavLink>
            <NavLink to='searchChemicalIndexes'>Search chemical indexes</NavLink>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
      </div>
      
 
    )
}

export default RootLayout;