import React, { useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { useNavigate } from "react-router";
import "./Login.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getByIndex, update } = useIndexedDB("users");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await getByIndex("email", email);
      if (user && user.password === password) {
        const currentTimestamp = new Date().toLocaleString();
        const updatedUser = {
          ...user,
          previousLogins: user.previousLogins
            ? [...user.previousLogins, currentTimestamp]
            : [currentTimestamp],
        };
        await update(updatedUser);
        navigate("/userlist");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("Error while logging in: " + error);
    }
  };

  return (
    <>
      <div className="login">
        <ToastContainer/>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label> Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label> Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <span>
            Not registered? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
