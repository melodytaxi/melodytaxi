// Importing necessary libraries and components
import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useState } from "react";

// Login component definition
export default function Login() {

  // Create references for email and password input fields
  const emailRef = createRef()
  const passwordRef = createRef()

  // Destructure setDriver and setToken from state context
  const { setDriver, setToken } = useStateContext()

  // State variable for error or success message
  const [message, setMessage] = useState(null)

  // Function to handle form submission
  const onSubmit = ev => {
    ev.preventDefault()

    // Create payload object with email and password
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }

    // Send POST request to the /login endpoint
    axiosClient.post('/login', payload)
      .then(({data}) => {
        // On successful login, update driver and token in state
        setDriver(data.driver)
        setToken(data.token);
      })
      .catch((err) => {
        // On error, check if error status is 422 and set the error message
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  // Render Login form
  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }

          <input ref={emailRef} type="email" placeholder="Email"/>
          <input ref={passwordRef} type="password" placeholder="Password"/>
          <button className="btn btn-block">Login</button>
          <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}
