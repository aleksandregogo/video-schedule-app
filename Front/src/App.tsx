import { Routes, Route } from "react-router-dom";
import Login from "./App/Pages/login";


function App() {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
