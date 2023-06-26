import { useEffect, useState } from "react";
import { useRef } from "react";
import {
  deleteTripService,
  getTripById,
  tripsById,
} from "../services/tripService";
import { createComment, getComments } from "../services";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import "./publication.css";
import useTrip from "../hooks/useTrip";

function Publication({
  datos,
  comments,
  setComments,
  setTrips,
  userNameTrips,
  setUserNameTrips,
  deleteTrip,
  setDatosToEdit,
  setMarkerData,
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const targetRef = useRef(null);

  const [commentarie, setCommentarie] = useState();
  const [seeComments, setSeeComments] = useState(false);

  const [modal, setModal] = useState(false);

  const navigateTo = useNavigate();

  const comentar = async () => {
    const newComentarie = await createComment(datos.ID, commentarie);
    console.log(newComentarie[0]);
    await setComments(await getComments(datos.ID));

    targetRef.current?.scrollIntoView({
      bottom: 0,
      behavior: "smooth",
    });

    setCommentarie("");
  };

  const viewComments = () => {
    setSeeComments(!seeComments);
    if (!user) {
      setCommentarie("You must be registered to comment");
    }
  };

  const onchangeCommentarie = (e) => {
    setCommentarie(e.target.value);
  };

  const goBack = () => {
    navigateTo("/profile");
  };

  const editTrip = () => {
    setDatosToEdit(datos);
    navigateTo("/edittrip");
  };

  const viewInMap = (datos) => {
    navigateTo("/maps");
    setMarkerData({
      zoom: 4,
      lat: datos.latitude,
      lng: datos.longitude,
    });

    setTimeout(() => {
      setMarkerData({
        zoom: 6,
        lat: datos.latitude,
        lng: datos.longitude,
      });
    }, 500);

    setTimeout(() => {
      setMarkerData({
        zoom: 8,
        lat: datos.latitude,
        lng: datos.longitude,
      });
    }, 1000);

    setTimeout(() => {
      setMarkerData({
        zoom: 10,
        lat: datos.latitude,
        lng: datos.longitude,
      });
    }, 1500);

    setTimeout(() => {
      setMarkerData({
        zoom: 12,
        lat: datos.latitude,
        lng: datos.longitude,
      });
    }, 2000);
  };

  return (
    <div className="selectedTrip-container">
      <div className="back" onClick={() => goBack()}>
        Back
      </div>
      {datos.userName === user?.userName && (
        <button className="btn-editTrip" onClick={() => editTrip()}>
          Edit-trip
        </button>
      )}

      <h2>{datos.city}</h2>
      <h3>{datos.excerpt}</h3>
      <div className="img-btn-container">
        <img
          className="img"
          src={`${import.meta.env.VITE_BACKEND_URL}/tripImages/${datos.image}`}
        />
        {datos.userName === user?.userName && (
          <button
            className="btn-deleteTrip"
            onClick={() => {
              setModal(true);
            }}
          ></button>
        )}
      </div>

      <div className="publication-actions-container">
        <div className="publication-likes-container">
          <div
            className="publication-likes"
            onClick={() => like(datos.ID)}
          ></div>
          <p>{datos.votes}</p>
        </div>
        <div className="comments-icono-container">
          <div
            className="coments"
            onClick={() => {
              viewComments();
            }}
          ></div>
          <p>{comments.length}</p>
        </div>

        <div className="view-in-map" onClick={() => viewInMap(datos)}></div>
        <p>{`${datos.distance} Km`}</p>
      </div>

      <h3 className="trip-description">{datos.description}</h3>

      {seeComments && (
        <div className="comentaries-gral">
          {comments.map((coment, index) => {
            return (
              <div
                ref={targetRef}
                key={index}
                className="comentaries-container"
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/userImages/${
                    coment.image
                  }`}
                />
                <div className="user-data">
                  <h3>{coment.username}</h3>
                  <h3 className="font-comentaries">{coment.comentaries}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {seeComments && (
        <div className="inputComent-container">
          <input
            type="text"
            id="comment"
            className="input-comment"
            value={commentarie}
            onChange={onchangeCommentarie}
          />
          {user && (
            <button
              onClick={() => {
                comentar();
              }}
            >
              <p>SEND</p>
            </button>
          )}
        </div>
      )}
      <div className="scroll" ref={targetRef}></div>
      {modal === true && (
        <div className="modal-container">
          <div className="modal">
            <h2 className="delete-text">
              Seguro desea eliminar esta publicacion?
            </h2>
            <button className="btn-delete" onClick={() => deleteTrip(datos.ID)}>
              Delete
            </button>
            <button className="btn-cancel" onClick={() => setModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Publication;
