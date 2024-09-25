import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import PreviousLogins from "./PreviousLogins";
import { useNavigate } from "react-router";
import "./UserList.css";
import { toast, ToastContainer } from "react-toastify";

const UserList = () => {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const { getAll, update, deleteRecord } = useIndexedDB("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    getAll().then(setUsers);

  }, [getAll]);
  const handleEdit = (user) => {
    nav(`/useredit/${user.id}`);
  };
  const handlePreviousLogins = (user) => {
    setSelectedUser(user);
    setModal(true);
 
  };
  const handleBlock = (user) => {
    user.status = "blocked";
    update(user).then(() =>
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)))
    );
  };
  const handleUnblock = (user) => {
    user.status = "active";
    update(user).then(() =>
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)))
    );
  };
  const handleDelete = (user) => {
    const confirmed = window.confirm("Do you want to delete this user?");

    if (confirmed) {
      deleteRecord(user.id)
        .then(() => {
          toast.success("User deleted");
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
        })
        .catch((error) => {
          toast.error("Failed to delete user: " + error);
        });
    } else {
      toast.error("User deletion canceled");
    }
  };
  return (
    <div className="user-list-container">
        <ToastContainer/>
      <h2>Users List</h2>
      <table>
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th colSpan={5}>Actions</th>
        </thead>
        {users.map((user) => {
          return (
            <tbody key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.password}</td>
              <td>
                <button className="block" onClick={() => handleBlock(user)}>
                  Block
                </button>
              </td>
              <td>
                <button className="unblock" onClick={() => handleUnblock(user)}>
                  Unblock
                </button>
              </td>
              <td>
                <button className="delete" onClick={() => handleDelete(user)}>
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="previouslogins"
                  onClick={() => handlePreviousLogins(user)}
                >
                  Previous Logins
                </button>
              </td>
              <td>
                <button
                  className="edit"
                  onClick={() => {
                    handleEdit(user);
                  }}
                >
                  Edit
                </button>
              </td>
            </tbody>
          );
        })}
      </table>
      {modal && (
        <>
          <div className="modal-overlay" />
          <PreviousLogins user={selectedUser} onClose={() => setModal(false)} />
        </>
      )}
    </div>
  );
};

export default UserList;
