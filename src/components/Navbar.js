import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li className='p-button p-component'>
                    <Link to="/mini">Create Speaking Club</Link>
                </li>
                <li className='p-button p-component'>
                    <Link to="/manage">Manage Speaking Clubs</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
