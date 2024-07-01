import React from 'react';
import { login } from '../authService';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css'; // Import the CSS file for styling
import TrelloPic from '../assets/png-transparent-trello-social-icons-icon.png'; // Importing the image

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // You need to implement the login function using email and password
        await login(values.email, values.password);
        navigate('/'); // Redirect to main app after successful login
      } catch (error) {
        console.error("Error logging in: ", error);
      }
    },
  });

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
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <img src={TrelloPic} alt="Trello Logo" className="trello-logo" />
        <h1>Sign In</h1>
        <input
          type="email"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Email"
          required
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error-message">{formik.errors.email}</div>
        ) : null}
        <input
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Password"
          required
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error-message">{formik.errors.password}</div>
        ) : null}
        <button className='btn-submit' type="submit">Login</button>
        <button
          onClick={handleGoogleSignIn}
          style={{ marginTop: '10px', maxWidth: '100%' }}
          className="btn btn-light"
          type="button"
          data-mdb-ripple-init
        >
          <FcGoogle style={{ marginRight: '10px', fontSize: '30px' }} /> Login With Google
        </button>
        <p className="signup-link">
          Not a user? <a href="/signup">Sign up here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
