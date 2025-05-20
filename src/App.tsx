import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Auth/login/Login";
import SignUp from "./pages/Auth/register/SignUp";
import RegisterDoctor from "./pages/Auth/register/RegisterDoctor";
import Profile from "./pages/profilePage/Profile";
import CreatePrescriptionPage from "./pages/prescriptions/CreatePrescriptionPage";
import NormalLayout from "./Layouts/NormalLayout";
import RequiringAuth from "./Layouts/RequiringAuth";
import PrescriptionsPage from "./pages/PrescriptionsPage/PrescriptionsPage";
import SinglePagePrescription from "./pages/SinglePagePrescription/SinglePagePrescription";
import Analytics from "./pages/Analytics/Analytics";
import CategoryAnalytics from "./pages/CategoryAnalytics/CategoryAnalytics";
import ClassifcationAnalytics from "./pages/ClassifcationAnalytics/ClassifcationAnalytics";
import RegisterPatient from "./pages/Auth/register/RegisterPatient";
import CreateDiagonsis from "./pages/CreateDiagonisis/CreateDiagonsis";
import GeneralDrugAnalytics from "./pages/GeneralDrugAnalytics/GeneralDrugAnalytics";
import GeneralDiseaseAnalytics from "./pages/GeneralDiseaseAnalytics/GeneralDiseaseAnalytics";
import DefineAllergy from "./pages/DefineAllergy/DefineAllergy";
import SinglePatientPage from "./pages/profilePage/SinglePatientPage";
import Reports from "./pages/Reports/Reports";
import SingleReportPage from "./pages/SingleReportPage/SingleReportPage";
import { ToastContainer } from "react-toastify";
import ForgotPass from "./pages/Auth/reset-password/ForgotPass";
import ResetPass from "./pages/Auth/reset-password/ResetPass";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<Login />} path="/auth/login" />
          <Route element={<SignUp />} path="/auth/register" />
          <Route element={<RegisterPatient />} path="/auth/register/patient" />
          <Route element={<RegisterDoctor />} path="/auth/register/doctor" />
        </Route>

        <Route element={<ForgotPass />} path="/auth/forgot-password" />
        <Route element={<ResetPass />} path="/auth/reset-password" />

        <Route element={<RequiringAuth />}>
          <Route element={<NormalLayout />}>
            <Route element={<Profile />} path="/dashboard" />
            <Route
              element={<SinglePagePrescription />}
              path="/prescription/:id"
            />
            <Route element={<SinglePatientPage />} path="/patient/:nid" />
            <Route element={<PrescriptionsPage />} path="/prescription" />
            <Route element={<CategoryAnalytics />} path="/analytics/:id" />
            <Route
              element={<ClassifcationAnalytics />}
              path="/analytics/classification/:id"
            />
            <Route element={<Reports />} path="/reports" />
            <Route element={<SingleReportPage />} path="/report/:reportId" />
            <Route element={<Analytics />} path="/analytics" />
            <Route
              element={<GeneralDrugAnalytics />}
              path="/analytics/general-drug-analytics"
            />
            <Route
              element={<GeneralDiseaseAnalytics />}
              path="/analytics/general-disease-analytics"
            />
            <Route
              element={<CreatePrescriptionPage />}
              path="/prescription/create"
            />
            <Route element={<DefineAllergy />} path="/allergy/create" />
            <Route element={<CreateDiagonsis />} path="/diagnosis/create" />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  );
}

export default App;
