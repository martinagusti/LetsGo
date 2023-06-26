import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp, uploadFile } from "../services";
import { useNavigate } from "react-router-dom";

import "./register.css";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordError, setPasswordError] = useState(false);

  const [errorTextRegister, setErrorTextRegister] = useState();

  const [avatarUrl, setAvatarUrl] = useState();

  const navigateTo = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await signUp(
        data.name,
        data.lastname,
        data.username,
        data.email,
        data.password,
        data.confirmPassword,
        data.bio
      );
      console.log(response);

      if (response.status === 201) {
        navigateTo("/login");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response.request.status === 409 ||
        error.response.request.status === 500
      ) {
        setErrorTextRegister(error.response.data.error);
      }
    }
  };

  return (
    <div className="register-form">
      <div className="caja">
        <form onSubmit={handleSubmit(onSubmit)} className="container-form">
          <label>Name</label>
          <input
            type="text"
            {...register("name", {
              required: true,
            })}
          />

          {errors.name?.type === "required" && <span>Campo requerido</span>}
          <label>Lastname</label>
          <input
            type="text"
            {...register("lastname", {
              required: true,
            })}
          />

          {errors.lastname?.type === "required" && <span>Campo requerido</span>}

          <label>UserName</label>
          <input
            type="text"
            {...register("username", {
              required: true,
            })}
          />

          {errors.username?.type === "required" && <span>Campo requerido</span>}

          <label>Email</label>
          <input
            type="text"
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
          {errors.email?.type === "required" && <span>Campo requerido</span>}
          {errors.email?.type === "pattern" && <span>Email no valido</span>}

          <label>Password</label>

          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
          />
          {errors.password?.type === "required" && <span>Campo requerido</span>}
          {errors.password?.type === "minLength" && (
            <span>Tu contraseña deberia tener al menos 6 digitos</span>
          )}

          <label>Confirm Password</label>

          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              minLength: 6,
            })}
          />
          {errors.confirmPassword?.type === "required" && (
            <span>Campo requerido</span>
          )}
          {errors.confirmPasswordsword?.type === "minLength" && (
            <span>Tu contraseña deberia tener al menos 6 digitos</span>
          )}
          {passwordError && <span>La contraseña no coincide</span>}

          <label>Biography</label>
          <textarea
            rows="4"
            cols="25"
            {...register("biography")}
            id="text-area"
          ></textarea>

          {errorTextRegister && <span>{errorTextRegister}</span>}
          <button type="submit" id="btn-register">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
