import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logout Successfully")
            navigate('/login');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light navbar-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img
                        src="https://1000logos.net/wp-content/uploads/2021/05/Trello-logo.png"
                        alt="Trello Logo"
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                    />
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                      
                    </ul>
                    <button onClick={handleLogout} className="btn btn-outline-danger">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
