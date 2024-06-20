import React, { useState } from 'react';
import { login } from '../authService';
import './Login.css'; // Import the CSS file for styling
import TrelloPic from '../assets/png-transparent-trello-social-icons-icon.png'; // Importing the image
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to app page
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to main app after successful login
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={TrelloPic} alt="Trello Logo" className="trello-logo" />
        <h1>Sign In</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className='btn-submit' type="submit">Login</button>
        <button onClick={handleGoogleSignIn} style={{marginTop:'10px',maxWidth:'100%'}} className="btn btn-light" type="button" data-mdb-ripple-init><FcGoogle style={{ marginRight: '10px',fontSize:'30px' }} /> Login With Google</button>
        <p className="signup-link">
          Not a user? <a href="/signup">Sign up here</a>
        </p>
        
      </form>
    </div>
  );
};

export default Login;

