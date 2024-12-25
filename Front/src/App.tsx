import { Routes, Route } from "react-router-dom";
import Screens from "./pages/screens";
import Layout from "./components/layout";
import Campaigns from "./pages/campaigns";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Screens />} />
        <Route path="/screens" element={<Screens />} />

        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<Campaigns />} />
      </Route>
    </Routes>
  );
}

export default App;
