import { Routes, Route } from "react-router-dom";
import Screens from "./pages/screens";
import Layout from "./components/layout";
import Campaigns from "./pages/campaigns";
import { useAuth } from "./contexts/authProvider";
import Reviews from "./pages/reviews";


function App() {
const { isCompany } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Screens />} />
        <Route path="/screens" element={<Screens />} />

        {!isCompany && <Route path="/campaigns" element={<Campaigns />} />}
        {isCompany && <Route path="/reviews" element={<Reviews />} />}
      </Route>
    </Routes>
  );
}

export default App;
