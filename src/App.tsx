import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Auth/login/Login";
import SignUp from "./pages/Auth/register/SignUp";
import Register from "./pages/Auth/register/Register";
import Profile from "./pages/profilePage/Profile";
import CreatePrescriptionPage from "./pages/prescriptions/CreatePrescriptionPage";
import NormalLayout from "./Layouts/NormalLayout";
import RequiringAuth from "./Layouts/RequiringAuth";
import PrescriptionsPage from "./pages/PrescriptionsPage/PrescriptionsPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<Login />} path="/login" />
        <Route element={<SignUp />} path="/register" />
        <Route element={<Register />} path="/signUp" />
      </Route>

      <Route element={<RequiringAuth />}>
        <Route element={<NormalLayout />}>
          <Route element={<Profile />} path="/profile/" />
          <Route element={<PrescriptionsPage />} path="/prescription" />
          <Route element={<CreatePrescriptionPage />} path="/prescription/create" />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
