import { Routes, Route } from "react-router-dom";
import Login from "./App/Pages/login";
import Dashboard from "./App/Pages/dashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
