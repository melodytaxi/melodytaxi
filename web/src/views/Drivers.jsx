import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Drivers() {
  // Defining state variables
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();

  // Using useEffect to fetch drivers data as soon as component mounts
  useEffect(() => {
    getDrivers();
  }, []);

  // Function to delete a driver
  const onDeleteClick = (driver) => {
    // Always confirm before deleting to prevent accidental clicks
    if (!window.confirm("Are you sure you want to delete this driver?")) {
      return;
    }
    // Make DELETE request to server
    axiosClient
      .delete(`/drivers/${driver.id}`)
      .then(() => {
        // Update UI and fetch updated drivers list after deleting
        setNotification("Driver was successfully deleted");
        getDrivers();
      })
      .catch((err) => {
        // Handle error if any during the request
        console.error(err);
      });
  };

  // Function to fetch drivers
  const getDrivers = () => {
    setLoading(true);
    axiosClient
      .get("/drivers")
      .then(({data}) => {
        setLoading(false);
        // Always validate data before setting to state
        if (data && data.data) {
          setDrivers(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        // Handle error if any during the request
        console.error(err);
      });
  };

  return (
    <div data-testid="checkEmail">
      <div
        style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
      >
        <h1>Drivers</h1>
        <Link className="btn-add" to="/drivers/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading && (
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
            {drivers.map((u) => (
              <tr key={u?.id}>
                <td>{u?.id}</td>
                <td>{u?.name}</td>
                <td>{u?.email}</td>
                <td>{u?.created_at}</td>
                <td>
                  <Link className="btn-edit" to={"/drivers/" + u?.id}>
                    Edit
                  </Link>
                  &nbsp;
                  <button className="btn-delete" onClick={(ev) => onDeleteClick(u)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
