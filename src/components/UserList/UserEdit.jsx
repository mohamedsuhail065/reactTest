import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEdit = () => {
  const { id } = useParams();
  const { getByID, update } = useIndexedDB("users");
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    getByID(parseInt(id))
      .then((user) => {
        if (user) {
          setUname(user.username);
          setEmail(user.email);
          setUser(user);
        } else {
          toast.error("User not found");
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch user:", error);
      });
  }, [id, getByID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, username: uname, email };
    update(updatedUser).then(() => {
      toast.success("User updated successfully!");
      setTimeout(()=>{
        nav("/userlist");
      },2000)
      
    });
  };

  return (
    <div className="user-edit-container">
      <ToastContainer />
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UserEdit;
