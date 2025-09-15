import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const Logout = () => {
    // const Navigate = useNavigate();
    useEffect(() => {

        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = "/"
    }, []);

    return (
        <div>You have been logged out.</div>
    );
};

export default Logout;
