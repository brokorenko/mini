import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/mini">Create new Speaking Club</Link>
                </li>
                <li>
                    <Link to="/manage">Manage Speaking Clubs</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
