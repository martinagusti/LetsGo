import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  signUp,
  uploadFile,
  getComments,
  allTripsAxios,
  tripsByUserName,
} from "../services";

import "./profile.css";
import { AuthContext } from "../context/AuthContext";
import { getDistance } from "../utils.js/getDistance";
import { useNavigate } from "react-router-dom";

function Profile(
  { setIdTrip, setComments, selectProfile, userNameTrips, setUserNameTrips },
  userTrips
) {
  const coord = JSON.parse(localStorage.getItem("ubicacion"));
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  if (userNameTrips.length === 0) {
    return (
      <div className="profile-container">
        <div className="user">
          <div>
            <div className="img-cont">
              <img
                className="image-profile"
                src={`${import.meta.env.VITE_BACKEND_URL}/userImages/${
                  user.image
                }`}
                alt="avatar"
              />
              {user.id && (
                <div className="editar" onClick={() => editUser()}></div>
              )}
            </div>

            <h3>{user.userName}</h3>
            <h4>{user.email}</h4>
          </div>

          <p>{userNameTrips.length} Publications</p>
        </div>
        <h2>{user.bio}</h2>
      </div>
    );
  }

  userNameTrips = userNameTrips.map((element) => {
    const distancia = getDistance(
      element.latitude,
      element.longitude,
      coord.lat,
      coord.lng
    );
    element.distance = Math.round(distancia);
    element.userImage = element.userImage ? element.userImage : user.image;
    element.userName = element.userName ? element.userName : user.userName;
    element.votes = element.votes ? element.votes : 0;

    return element;
  });

  const navigateTo = useNavigate();

  const selectImage = async (dato) => {
    setIdTrip(dato);

    const comments = await getComments(dato.ID);
    setComments(comments);
    navigateTo(`/publication/${dato.ID}`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigateTo("/login");
  };

  const editUser = () => {
    navigateTo("/editUser");
  };

  return (
    <div className="profile-container">
      <div className="user">
        <div>
          <div className="img-cont">
            <img
              className="image-profile"
              src={`${import.meta.env.VITE_BACKEND_URL}/userImages/${
                userNameTrips[0].userImage || user.image
              }`}
              alt="avatar"
            />
            {userNameTrips[0].IdUser === user.id && (
              <div className="editar" onClick={() => editUser()}></div>
            )}
          </div>

          <h3>{userNameTrips[0].userName}</h3>
          <h4>{userNameTrips[0].email}</h4>
        </div>

        <p>{userNameTrips.length} Publications</p>
      </div>
      <h2>{userNameTrips[0].bio}</h2>

      <div className="userName-trips">
        {userNameTrips.map((dato, index) => {
          return (
            <div className="userTrip-container" key={index}>
              <img
                className="user-images"
                src={`${import.meta.env.VITE_BACKEND_URL}/tripImages/${
                  dato.image
                }`}
                onClick={() => selectImage(dato)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
