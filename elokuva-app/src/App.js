import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import UserPage from "./pages/UserPage";
import GroupPage from "./pages/GroupPage";
import RegGroup from "./pages/RegGroup";
import AllGroups from "./pages/AllGroups";
import Search from "./pages/Search";
import ShowTimes from "./pages/ShowTimes";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Route, Routes } from "react-router-dom";
import UserProvider from "./context/UserProvider";


function App() {
  return (
    <UserProvider>
      <div className="site-container">
      <Navbar></Navbar>
      <div className="container">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/grouppage" element={<GroupPage />} />
          <Route path="/reggroup" element={<RegGroup />} />
          <Route path="/allgroups" element={<AllGroups />} />
          <Route path="/search" element={<Search />} />
          <Route path="/showtimes" element={<ShowTimes />} />
          <Route path="/adminpage" element = {<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer></Footer>
      </div>
    </UserProvider>
  );
}

export default App;
