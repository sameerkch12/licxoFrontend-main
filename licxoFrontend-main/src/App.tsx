import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GoogleSearch from "@/components/GoogleSearch";
import AddRoom from "@/pages/AddRoom";
import ProfilePage from "./pages/Profile";
//import LoginSignup from "./pages/LoginSignup";
import LoginFlow from "./components/LoginFlow";

function App() {
  return (
    <Routes>
      <Route element={  <IndexPage />} path="/" />
      <Route element={ <AddRoom/> } path="/addroom" />
      <Route element={<ProfilePage/>} path="/profile" />
     <Route path="/search" element={<GoogleSearch />} />
     <Route path="login" element={<LoginFlow/>}> </Route>
    </Routes>
  );
}

export default App;
