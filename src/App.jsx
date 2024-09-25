import "./App.css";
import Register from "./components/Register/Register";
import UserList from "./components/UserList/UserList";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router";
import UserEdit from "./components/UserList/UserEdit";
import Navbar from "./components/Navbar/Navbar";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/useredit/:id" element={<UserEdit />} />
      </Routes>
    </>
  );
}

export default App;
