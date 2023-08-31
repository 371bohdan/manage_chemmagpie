import { NavLink, Outlet } from 'react-router-dom';

const HelpLayout = () => {
    return (
        <div className='help-layout'>
            <nav>
                <NavLink to="faq">View the FAQ</NavLink>
                <NavLink to="contact">Contact us</NavLink>
            </nav>
            <h1>Website Help</h1>
            <p>Lorem ipsum dollor</p>
            <Outlet />
        </div>
    )
}


export default HelpLayout;