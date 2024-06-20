import React, { useState } from 'react';
import { signup } from '../authService';
import './Signup.css'; // Import the CSS file for styling
import TrelloPic from '../assets/png-transparent-trello-social-icons-icon.png'; // Importing the image
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FcGoogle } from 'react-icons/fc';

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      // Redirect to app page
      navigate('/'); // Example redirect to home after signup
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to main app after successful signup
    } catch (error) {
      console.error('Error signing up with Google: ', error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <img src={TrelloPic} alt="Trello Logo" className="trello-logo" />
        <h1>Sign Up</h1>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button className='signup-btn' type="submit">Sign Up</button>
        <button onClick={handleGoogleSignUp} className="google-signin">
          <FcGoogle style={{ marginRight: '10px', fontSize: '30px' }} /> Sign Up With Google
        </button>
        <p className="login-link">
          Already have an account? <a href="/login">Sign In here</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
