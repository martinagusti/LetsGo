import { useContext, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Header from "./components/headers/Header.jsx";
import Trips from "./components/trips/Trips.jsx";
import Footer from "./components/footer/Footer.jsx";
import Initial from "./pages/Initial.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Maps from "./pages/Maps.jsx";
import Publication from "./pages/Publication.jsx";
import Favourites from "./pages/Favourites.jsx";
import EditUser from "./pages/EditUser.jsx";
import EditTrip from "./pages/EditTrip.jsx";

import {
  allTripsParams,
  deleteTripService,
  favourites,
  likeTrip,
  setFavourites,
  tripsByUserName,
} from "./services/index.js";

import "./app.css";

import useTrips from "./hooks/useTrips.js";
import CreateTrips from "./pages/CreateNewTrips.jsx";
import CreateNewTrips from "./pages/CreateNewTrips.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { useNavigate } from "react-router-dom";
import useTrip from "./hooks/useTrip.js";

let params = JSON.parse(sessionStorage.getItem("params")) || "";

let viajes = await allTripsParams(params);

let getUserNameTrips = [];
let user = JSON.parse(localStorage.getItem("user"));

if (user) {
  getUserNameTrips = await tripsByUserName(user?.userName);
}

let favouritesTrips = [];
if (user) {
  favouritesTrips = await favourites();
}

function App() {
  user = JSON.parse(localStorage.getItem("user"));

  const { trips, setTrips } = useTrips();

  const [distance, setDistance] = useState(24000);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [showingPage, setShowingPage] = useState(user ? "search" : "initial");
  const [order, setOrder] = useState("fechapublicacion");
  const [idTrip, setIdTrip] = useState();
  const [comments, setComments] = useState();
  const [selectProfile, setSelectProfile] = useState();
  const [userNameTrips, setUserNameTrips] = useState(getUserNameTrips);
  const [favsTrips, setFavsTrips] = useState(favouritesTrips);
  const [datosToEdit, setDatosToEdit] = useState();
  const [markerData, setMarkerData] = useState({ zoom: 4, lat: 40, lng: 2 });

  const navigateTo = useNavigate();

  useEffect(() => {
    const cleanFilters = async () => {
      try {
        setCity("");
        setCategory("");
        setOrder("fechapublicacion");
        setDistance(24000);
      } catch (error) {
        setError(error.message);
      }
    };
    cleanFilters();
  }, [showingPage === "new"]);

  const deleteTrip = async (id) => {
    await deleteTripService(id);
    setUserNameTrips(userNameTrips.filter((element) => element.ID !== id));
    setTrips(trips.filter((element) => element.ID !== id));
    navigateTo("/profile");
    setShowingPage("profile");
  };

  const liked = async (id) => {
    await likeTrip(id);
    setTrips(
      trips.map((element) => {
        if (element.ID === id) {
          element.like === true
            ? (element.votes = element.votes - 1)
            : (element.votes = element.votes + 1);
          element.like = !element.like;
        }

        return element;
      })
    );
  };

  const setInFavourites = async (dato) => {
    const a = await setFavourites(dato.ID);

    if (a.data === false) {
      setTrips(
        trips.map((element) => {
          element.ID === dato.ID ? (element.favourite = false) : element;
          return element;
        })
      );

      setFavsTrips(
        favsTrips.filter((element) => {
          return element.ID !== dato.ID;
        })
      );
    } else {
      setTrips(
        trips.map((element) => {
          element.ID === dato.ID ? (element.favourite = true) : element;
          return element;
        })
      );
      setFavsTrips([dato, ...favsTrips]);
    }
  };

  const handleOnChange = (e) => {
    setDistance(Number(e.target.value));
  };

  const handleOnChangeOrder = (e) => {
    setOrder(e.target.value);
  };

  const changeCity = (e) => {
    setDistance(Number(24000));
    setCity(e.target.value.toUpperCase());
  };

  const changeCategory = (e) => {
    setCategory(e.target.value);
  };

  const ok = async () => {
    console.log("Sacar este boton!!!");
  };
  console.log(showingPage);
  return (
    <div className="app-container">
      {showingPage !== "maps" &&
        showingPage !== "new" &&
        showingPage !== "profile" &&
        showingPage !== "favourites" &&
        showingPage !== "publication" && (
          <Header
            favourites={favourites}
            ok={ok}
            handleOnChange={handleOnChange}
            handleOnChangeCity={changeCity}
            handleOnChangeCategory={changeCategory}
            city={city}
            category={category}
            distance={distance}
            order={order}
            setShowingPage={setShowingPage}
            showingPage={showingPage}
            handleOnChangeOrder={handleOnChangeOrder}
            setTrips={setTrips}
          />
        )}

      <Routes>
        <Route
          path="/"
          element={
            <Initial
              setShowingPage={setShowingPage}
              showingPage={showingPage}
            />
          }
        />
        <Route
          path="/home"
          element={
            <Trips
              datos={trips}
              setTrips={setTrips}
              showingPage={showingPage}
              setShowingPage={setShowingPage}
              setIdTrip={setIdTrip}
              setComments={setComments}
              setSelectProfile={setSelectProfile}
              setUserNameTrips={setUserNameTrips}
              trips2={viajes}
              order={order}
              distance={distance}
              category={category}
              city={city}
              liked={liked}
              setInFavourites={setInFavourites}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login setShowingPage={setShowingPage} setTrips={setTrips} />
          }
        />

        <Route
          path="/register"
          element={<Register setShowingPage={setShowingPage} />}
        />

        <Route
          path="/profile"
          element={
            <Profile
              setShowingPage={setShowingPage}
              selectProfile={selectProfile}
              setSelectProfile={setSelectProfile}
              setIdTrip={setIdTrip}
              setComments={setComments}
              userNameTrips={userNameTrips}
            />
          }
        />

        <Route
          path="/publication/:id"
          element={
            <Publication
              setShowingPage={setShowingPage}
              datos={idTrip}
              comments={comments}
              setComments={setComments}
              setTrips={setTrips}
              userNameTrips={userNameTrips}
              setUserNameTrips={setUserNameTrips}
              deleteTrip={deleteTrip}
              setDatosToEdit={setDatosToEdit}
              setMarkerData={setMarkerData}
            />
          }
        />

        <Route
          path="/favourites"
          element={
            <Favourites
              setShowingPage={setShowingPage}
              selectProfile={selectProfile}
              setSelectProfile={setSelectProfile}
              setIdTrip={setIdTrip}
              setComments={setComments}
              userNameTrips={userNameTrips}
            />
          }
        />

        <Route
          path="/maps"
          element={
            <Maps
              showingPage={showingPage}
              trips={trips}
              setShowingPage={setShowingPage}
              setIdTrip={setIdTrip}
              setComments={setComments}
              markerData={markerData}
              setMarkerData={setMarkerData}
            />
          }
        />

        <Route
          path="/newtrip"
          element={
            <CreateNewTrips
              setShowingPage={setShowingPage}
              setTrips={setTrips}
              trips={trips}
            />
          }
        />

        <Route
          path="/edituser"
          element={
            <EditUser
              setShowingPage={setShowingPage}
              setTrips={setTrips}
              trips={trips}
            />
          }
        />
        <Route
          path="/edittrip"
          element={
            <EditTrip
              setShowingPage={setShowingPage}
              setTrips={setTrips}
              trips={trips}
              datosToEdit={datosToEdit}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/*  {showingPage === "search" && (
        <Trips
          datos={trips}
          setTrips={setTrips}
          showingPage={showingPage}
          setShowingPage={setShowingPage}
          setIdTrip={setIdTrip}
          setComments={setComments}
          setSelectProfile={setSelectProfile}
          setUserNameTrips={setUserNameTrips}
          trips2={viajes}
          order={order}
          distance={distance}
          category={category}
          city={city}
          liked={liked}
          setInFavourites={setInFavourites}
        />
      )} */}
      {/* {showingPage === "home" && !user && (
        <Initial setShowingPage={setShowingPage} showingPage={showingPage} />
      )} */}
      {/*  {showingPage === "login" && (
        <Login setShowingPage={setShowingPage} setTrips={setTrips} />
      )} */}
      {/*  {showingPage === "sign-up" && (
        <Register setShowingPage={setShowingPage} />
      )} */}
      {/*  {showingPage === "profile" && (
        <Profile
          setShowingPage={setShowingPage}
          selectProfile={selectProfile}
          setSelectProfile={setSelectProfile}
          setIdTrip={setIdTrip}
          setComments={setComments}
          userNameTrips={userNameTrips}
        />
      )} */}
      {/* {showingPage === "publication" && (
        <Publication
          setShowingPage={setShowingPage}
          datos={idTrip}
          comments={comments}
          setComments={setComments}
          setTrips={setTrips}
          userNameTrips={userNameTrips}
          setUserNameTrips={setUserNameTrips}
          deleteTrip={deleteTrip}
          setDatosToEdit={setDatosToEdit}
          setMarkerData={setMarkerData}
        />
      )} */}
      {/*   {showingPage === "favourites" && (
        <Favourites
          setShowingPage={setShowingPage}
          selectProfile={selectProfile}
          setSelectProfile={setSelectProfile}
          setIdTrip={setIdTrip}
          setComments={setComments}
          userNameTrips={userNameTrips}
        />
      )} */}
      {/*   {showingPage === "maps" && (
        <Maps
          showingPage={showingPage}
          trips={trips}
          setShowingPage={setShowingPage}
          setIdTrip={setIdTrip}
          setComments={setComments}
          markerData={markerData}
          setMarkerData={setMarkerData}
        />
      )} */}
      {/*  {showingPage === "new" && user && (
        <Mapa
          setShowingPage={setShowingPage}
          setTrips={setTrips}
          trips={trips}
        />
      )} */}
      {/*  {showingPage === "editUser" && user && (
        <EditUser
          setShowingPage={setShowingPage}
          setTrips={setTrips}
          trips={trips}
        />
      )} */}
      {/*  {showingPage === "editTrip" && user && (
        <EditTrip
          setShowingPage={setShowingPage}
          setTrips={setTrips}
          trips={trips}
          datosToEdit={datosToEdit}
        />
      )} */}

      {showingPage !== "initial" && (
        <Footer
          setSelectProfile={setSelectProfile}
          setUserNameTrips={setUserNameTrips}
          setShowingPage={setShowingPage}
        />
      )}
    </div>
  );
}

export default App;
