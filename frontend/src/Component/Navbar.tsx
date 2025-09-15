import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-6 text-white">
                <li>
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                </li>

                {!token ? (
                    <>
                        <li><Link to="/" className="hover:text-gray-300">Login</Link></li>
                        <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
                        <li> <button onClick={() => navigate("/logout")} className="hover:text-gray-300">Logout </button> </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
