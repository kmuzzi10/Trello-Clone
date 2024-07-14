import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import './Login.css'; // Import the CSS file for styling
import TrelloPic from '../assets/png-transparent-trello-social-icons-icon.png'; // Importing the image
import { login } from "../authService";

// Import Formik and Yup
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FcGoogle } from 'react-icons/fc'; // Import FcGoogle

const Login = () => {
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
        // Implement the login function using email and password
        await login(values.email, values.password);
        toast.success("Login successful!"); // Success toast notification
        navigate('/'); // Redirect to main app after successful login
      } catch (error) {
        toast.error("Error logging in. Please try again."); // Error toast notification
        console.error("Error logging in: ", error);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!"); // Success toast notification
      navigate('/'); // Redirect to main app after successful login
    } catch (error) {
      toast.error("Error signing in with Google. Please try again."); // Error toast notification
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
      {/* <ToastContainer /> Add ToastContainer to show notifications */}
    </div>
  );
};

export default Login;