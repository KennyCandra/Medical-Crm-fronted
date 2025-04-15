import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Auth/login/Login";
import SignUp from "./pages/Auth/register/SignUp";
import Register from "./pages/Auth/register/Register";
import Profile from "./pages/profilePage/Profile";
import CreatePrescriptionPage from "./pages/prescriptions/CreatePrescriptionPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<Login />} path="/login" />
        <Route element={<SignUp />} path="/register" />
        <Route element={<Register />} path="/signUp" />
        <Route element={<Profile />} path="/profile/:id" />
        <Route element={<CreatePrescriptionPage />} path="/prescription" />
      </Route>
    </Routes>
  );
}

export default App;
