import React from 'react';
import { signup } from '../authService'; // Ensure this function is updated to accept name
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import './Signup.css'; // Import the CSS file for styling
import TrelloPic from '../assets/png-transparent-trello-social-icons-icon.png'; // Importing the image

const Signup = () => {
  const navigate = useNavigate();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Implement the signup function using email, password, and name
        await signup(values.email, values.password, values.name);
        toast.success("Signup successful!"); // Success toast notification
        navigate('/'); // Redirect to main app after successful signup
      } catch (error) {
        toast.error("Error signing up. Please try again."); // Error toast notification
        console.error('Error signing up: ', error);
      }
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Google signup successful!"); // Success toast notification
      navigate('/'); // Redirect to main app after successful signup
    } catch (error) {
      toast.error("Error signing up with Google. Please try again."); // Error toast notification
      console.error('Error signing up with Google: ', error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={formik.handleSubmit}>
        <img src={TrelloPic} alt="Trello Logo" className="trello-logo" />
        <h1>Sign Up</h1>
        <div className="form-group">
          <input
            type="text"
            name="name"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your name"
            required
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-message">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            required
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
            required
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
        </div>
        <button className='signup-btn' type="submit">Sign Up</button>
        <button
          onClick={handleGoogleSignUp}
          className="google-signin"
          type="button"
        >
          <FcGoogle style={{ marginRight: '10px', fontSize: '30px' }} /> Sign Up With Google
        </button>
        <p className="login-link">
          Already have an account? <a href="/login">Sign In here</a>
        </p>
      </form>
      <ToastContainer /> {/* Add ToastContainer to show notifications */}
    </div>
  );
};

export default Signup;