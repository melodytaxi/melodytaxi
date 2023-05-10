import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function DriverForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [driver, setDriver] = useState({
                                         id: null,
                                         name: '',
                                         email: '',
                                         password: '',
                                         password_confirmation: ''
                                       })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  // If an id is present in the URL params, fetch the driver data from the server
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/drivers/${id}`)
        .then(({data}) => {
          setLoading(false)
          setDriver(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [id])  // Make sure to include 'id' as a dependency
  }

  const onSubmit = ev => {
    ev.preventDefault()

    // Create a copy of the driver object without the 'id' field
    const driverData = {...driver}
    delete driverData.id

    if (driver.id) {
      // If the driver object has an id, update the driver data on the server
      axiosClient.put(`/drivers/${driver.id}`, driverData)
        .then(() => {
          setNotification('Driver was successfully updated')
          navigate('/drivers')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      // If the driver object doesn't have an id, create a new driver on the server
      axiosClient.post('/drivers', driverData)
        .then(() => {
          setNotification('Driver was successfully created')
          navigate('/drivers')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {driver.id && <h1>Update Driver: {driver.name}</h1>}
      {!driver.id && <h1>New Driver</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {!loading && errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input type="text" value={driver.name} onChange={e => setDriver({...driver, name: e.target.value})} placeholder="Full Name" />
            <input type="email" value={driver.email} onChange={e => setDriver({...driver, email: e.target.value})} placeholder="Email Address" />
            <input type="password" value={driver.password} onChange={e => setDriver({...driver, password: e.target.value})} placeholder="Password" />
            <input type="password" value={driver.password_confirmation} onChange={e => setDriver({...driver, password_confirmation: e.target.value})} placeholder="Confirm Password" />
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        )}
      </div>
    </>
  )
}
