import { useParams } from "react-router-dom";
import useTrip from "../hooks/useTrip";

function tripData(
  setShowingPage,
  comments,
  setComments,
  setTrips,
  userNameTrips,
  setUserNameTrips,
  deleteTrip,
  setDatosToEdit,
  setMarkerData
) {
  const { id } = useParams();

  const { trip, loading, error, comentaries } = useTrip(id);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Trip
      trip={trip}
      setShowingPage={setShowingPage}
      comments={comments}
      setComments={setComments}
      setTrips={setTrips}
      userNameTrips={userNameTrips}
      setUserNameTrips={setUserNameTrips}
      deleteTrip={deleteTrip}
      setDatosToEdit={setDatosToEdit}
      setMarkerData={setMarkerData}
      comentaries={comentaries}
    />
  );
}

export default tripData;
