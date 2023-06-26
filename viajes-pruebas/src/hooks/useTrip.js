import { useContext, useEffect, useState } from "react";
import {
  allTripsParams,
  favourites,
  getComments,
  isLike,
  likeTrip,
} from "../services";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTripById } from "../services/tripService";

const useTrip = (id) => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const params = JSON.parse(sessionStorage.getItem("params"));
    const user = JSON.parse(localStorage.getItem("user"));

    const loadTrip = async () => {
      try {
        setLoading(true);

        const data = await getTripById(id);
        const tripData = data.data;

        if (token) {
          const like = await isLike(tripData.ID);

          tripData.like = like.data.length > 0 ? true : false;
          const favoritos = await favourites();
          if (
            favoritos.filter((element) => {
              return element.ID === tripData.ID;
            }).length > 0
          ) {
            tripData.favourite = true;
          } else {
            tripData.favourite = false;
          }
        }

        setTrip(tripData);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [id]);

  return { trip, loading, error };
};

export default useTrip;
