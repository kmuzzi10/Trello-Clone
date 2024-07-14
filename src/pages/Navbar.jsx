import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are imported
import './Navbar.css'; // Import CSS file for additional styling

const NavbarComponent = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logout Successful");
            navigate('/login');
        } catch (error) {
            toast.error("Error logging out. Please try again.");
            console.error('Error logging out: ', error);
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="navbar">
                <Navbar.Brand href="/">
                    <img
                        src="https://1000logos.net/wp-content/uploads/2021/05/Trello-logo.png"
                        alt="Trello Logo"
                        className="navbar-logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Additional navigation items can be added here */}
                    </Nav>
                    <Button onClick={handleLogout} variant="outline-danger" className="ms-2">
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Navbar>
            {/* <ToastContainer /> */}
        </>
    );
};

export default NavbarComponent;