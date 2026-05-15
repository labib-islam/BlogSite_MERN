import React, { useContext, useRef, useState } from "react";
import UserIcon from "../../assets/icons/user-icon.svg?react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import axios from "axios";

import "./Auth.css";
import { useNavigate } from "react-router";
import AuthContext from "../contexts/AuthContext";

const Auth = () => {
  const { getLoggedIn } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const demoCredentials = {
    email: "demouser@gmail.com",
    password: "demouser123",
  };

  const [image, setImage] = useState();
  const imageInputRef = useRef(null);
  const selectImage = () => {
    imageInputRef.current.click();
  };
  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file || file.type.split("/")[0] !== "image") return;
    setImage({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    });
  };
  const deleteImage = (e) => {
    e.stopPropagation();
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    // Username validation (only on signup)
    if (isSignup) {
      if (!inputs.username) {
        newErrors.username = "Username is required.";
      } else if (inputs.username.length < 4) {
        newErrors.username = "Username must be at least 4 characters.";
      }
    }

    // Email validation
    if (!inputs.email) {
      newErrors.email = "Email is required.";
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(inputs.email)) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    // Password validation
    if (!inputs.password) {
      newErrors.password = "Password is required.";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    let data;
    if (isSignup) {
      const formData = new FormData();
      formData.append("username", inputs.username);
      image && formData.append("image", image.file);
      formData.append("email", inputs.email);
      formData.append("password", inputs.password);
      data = formData;
    } else {
      data = {
        email: inputs.email,
        password: inputs.password,
      };
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `/api/auth/${isSignup ? "signup" : "login"}`,
        data
      );
      localStorage.setItem("authToken", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      getLoggedIn();
      setIsLoading(false);
      toast.success("Logged In");
      navigate("/");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(
        err.response?.data ? err.response.data.message : "Something went wrong."
      );
    }
  };

  return (
    <main className="page-auth">
      <section className="auth-section__container">
        <header className="auth-header">
          <h1>{isSignup ? "Signup" : "Login"}</h1>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignup && (
            <section className="demo-credentials" aria-label="Demo credentials">
              <p>
                Demo email: <span>{demoCredentials.email}</span>
              </p>
              <p>
                Demo password: <span>{demoCredentials.password}</span>
              </p>
            </section>
          )}

          {isSignup && (
            <section className="image-username__container">
              <div className="image__container" onClick={selectImage}>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={onSelectImage}
                />

                {image ? (
                  <>
                    <span className="delete" onClick={deleteImage}>
                      &times;
                    </span>
                    <img src={image.url} alt="" />
                  </>
                ) : (
                  <>
                    <span className="add">+</span>
                    <UserIcon className="user-icon" />
                  </>
                )}
              </div>
              <div className="username__container input__container">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  style={
                    errors.username ? { borderColor: "var(--primary-red)" } : {}
                  }
                />
                {errors.username && <p>{errors.username}</p>}
              </div>
            </section>
          )}
          <div className="input__container">
            <input
              type="text"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              style={errors.email ? { borderColor: "var(--primary-red)" } : {}}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="input__container">
            <section className="password__container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                style={
                  errors.password ? { borderColor: "var(--primary-red)" } : {}
                }
              />
              <figure onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <AiFillEye className="password-eye" />
                ) : (
                  <AiFillEyeInvisible className="password-eye" />
                )}
              </figure>
            </section>
            {errors.password && <p>{errors.password}</p>}
          </div>
          <button>
            {isLoading ? (
              <span className="loader button"></span>
            ) : isSignup ? (
              "Signup"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Signup"}
          </span>
        </footer>
      </section>
    </main>
  );
};

export default Auth;
