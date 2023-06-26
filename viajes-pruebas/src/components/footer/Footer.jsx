import PropTypes from "prop-types";

import "./footer.css";
import { favourites, tripsByUserName } from "../../services";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Footer({ setSelectProfile, setUserNameTrips, setShowingPage }) {
  const { token } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const navigateTo = useNavigate();

  const getProfile = async () => {
    if (user) {
      setSelectProfile(user);
      setUserNameTrips(await tripsByUserName(user.userName));
      setShowingPage("profile");
      navigateTo("/profile");
    } else {
      setShowingPage("login");
      navigateTo("/login");
    }
  };

  const getFavourites = async () => {
    setSelectProfile(user);
    setUserNameTrips(await favourites());
    setShowingPage("favourites");
    navigateTo("/favourites");
  };

  return (
    <div className="footer-container">
      <div
        className="home"
        id="home"
        onClick={() => {
          navigateTo("/home");
          setShowingPage("search");
        }}
      ></div>
      {token && (
        <div
          className="new"
          id="new"
          onClick={() => {
            navigateTo("/newtrip");
            setShowingPage("newtrip");
          }}
        ></div>
      )}
      <div
        className="maps"
        id="maps"
        onClick={() => {
          navigateTo("/maps");
          setShowingPage("maps");
        }}
      ></div>
      {token && (
        <div
          className="favs"
          id="favourites"
          onClick={() => getFavourites("")}
        ></div>
      )}
      <div className="profile" id="profile" onClick={() => getProfile()}>
        {token && (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/UserImages/${
              user?.image
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default Footer;
