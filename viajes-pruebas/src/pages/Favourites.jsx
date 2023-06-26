import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signUp,
  uploadFile,
  getComments,
  allTripsAxios,
  tripsByUserName,
} from "../services";

import "./favourites.css";
import { getDistance } from "../utils.js/getDistance";
import { useNavigate } from "react-router-dom";

function Favourites(
  { setIdTrip, setComments, selectProfile, userNameTrips, setUserNameTrips },
  userTrips
) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigateTo = useNavigate();

  const coord = JSON.parse(localStorage.getItem("ubicacion"));

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

  const selectImage = async (dato) => {
    setIdTrip(dato);
    const comments = await getComments(dato.ID);
    setComments(comments);
    navigateTo(`/publication/${dato.ID}`);
  };

  return (
    <div className="profile-container">
      <div className="user">
        <h2>{userNameTrips.length} Favourites</h2>
      </div>

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

export default Favourites;
