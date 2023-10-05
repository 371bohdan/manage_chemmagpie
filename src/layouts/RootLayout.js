import { NavLink, Outlet } from 'react-router-dom';


const RootLayout = () => {
    return (
        <div className='root-layout'>
            <header>
            <nav>
            <h1>Chemmagpie</h1>
            <div className='grid-link'>
                <NavLink to='/' className='nav-link'>Home</NavLink>
                <NavLink to='about' className='nav-link'>About</NavLink>
                <NavLink to='addSamplingPlace' className='nav-link'>Add sampling place</NavLink>
                <NavLink to='addChemicalIndex' className='nav-link'>Add chemical Index</NavLink>
                <NavLink to='searchSamplingPlaces' className='nav-link'>Search sampling places</NavLink>
                <NavLink to='searchChemicalIndexes' className='nav-link'>Search chemical indexes</NavLink>
            </div>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
      </div>
      
 
    )
}

export default RootLayout;