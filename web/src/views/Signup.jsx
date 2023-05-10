// Import necessary libraries and hooks
import {Link} from "react-router-dom";
import {createRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

// Define the Signup component
export default function Signup() {
  // Create refs to handle form inputs
  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()

  // Get the necessary actions from the state context
  const {setDriver, setToken} = useStateContext()

  // Define a local state to handle errors
  const [errors, setErrors] = useState(null)

  // Define a function to validate the form inputs
  const validateInputs = () => {
    // Initialize an errors object
    const errors = {};

    // Validate the name
    if (!nameRef.current.value) {
      errors.name = 'Name is required.';
    }

    // Validate the email
    if (!emailRef.current.value) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) {
      errors.email = 'Email address is invalid.';
    }

    // Validate the password
    if (!passwordRef.current.value) {
      errors.password = 'Password is required.';
    } else if (passwordRef.current.value.length < 8) {
      errors.password = 'Password should be at least 8 characters.';
    }

    // Validate the password confirmation
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      errors.passwordConfirmation = 'Passwords do not match.';
    }

    return errors;
  }

  // Define the function to handle form submission
  const onSubmit = ev => {
    ev.preventDefault()

    // Validate the form inputs
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Create the request payload
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }

    // Make a POST request to the /signup endpoint
    axiosClient.post('/signup', payload)
      .then(({data}) => {
        // If the request is successful, update the global state
        setDriver(data.driver)
        setToken(data.token);
      })
      .catch(err => {
        // If the request fails, handle the error
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  // Define the component's output
  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup for Free</h1>
          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }
          <input ref={nameRef} type="text" placeholder="Full Name"/>
          <input ref={emailRef} type="email" placeholder="Email Address"/>
          <input ref={passwordRef} type="password" placeholder="Password"/>
          <input ref={passwordConfirmationRef} type="password" placeholder="Repeat Password"/>
          <button className="btn btn-block">Signup</button>
          <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
        </form>
      </div>
    </div>
  )
}
