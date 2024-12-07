import { Routes, Route } from "react-router-dom";
import Screens from "./pages/screens";
import Layout from "./components/layout";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Screens />} />
        <Route path="/screens" element={<Screens />} />
      </Route>
    </Routes>
  );
}

export default App;
