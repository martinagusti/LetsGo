import { useContext, useEffect, useState } from "react";
import { allTripsParams, favourites, isLike, likeTrip } from "../services";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useTrips = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const params = JSON.parse(sessionStorage.getItem("params"));
    const user = JSON.parse(localStorage.getItem("user"));

    const loadTrips = async () => {
      try {
        setLoading(true);

        const data = await allTripsParams(params ? params : "");

        if (token) {
          for (const trip of data) {
            const like = await isLike(trip.ID);

            trip.like = like.data.length > 0 ? true : false;
            const favoritos = await favourites();
            if (
              favoritos.filter((element) => {
                return element.ID === trip.ID;
              }).length > 0
            ) {
              trip.favourite = true;
            } else {
              trip.favourite = false;
            }
          }

          /* navigateTo("/home"); */
        }

        setTrips(data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [token]);

  return { trips, loading, error, setTrips, setUsuario };
};

export default useTrips;
