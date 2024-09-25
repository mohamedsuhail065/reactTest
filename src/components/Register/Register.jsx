import React, { useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import "../../db/Dbconfig";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { add, getAll } = useIndexedDB("users");
  const nav = useNavigate();
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isUniqueUser = async (username, email) => {
    const users = await getAll();
    return !users.some(
      (user) => user.username === username || user.email === email
    );
  };

  const validateInputs = async () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.";

    const isUnique = await isUniqueUser(username, email);
    if (!isUnique) newErrors.unique = "Username or Email already exists";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateInputs();
    if (isValid) {
      try {
        await add({ username, email, password, status: "active" });
        toast.success("User registered successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(()=>{
          nav("/")
        },2000);
      } catch (error) {
        toast.error("Error during registration: " + error.message);
      }
    }
  };

  return (
    <div className="register">
      <ToastContainer />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username}</span>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </div>
        {errors.unique && <span style={{ color: "red" }}>{errors.unique}</span>}
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
