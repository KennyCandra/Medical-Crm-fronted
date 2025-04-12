import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/login" />
    </Routes>
  );
}

export default App;
