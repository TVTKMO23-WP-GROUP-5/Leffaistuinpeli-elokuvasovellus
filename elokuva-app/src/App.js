import "./App.css";
import React from 'react';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import UserPage from "./pages/UserPage";
import UserFavorite from "./pages/UserFavorite";
import GroupPage from "./pages/GroupPage";
import MoviePage from "./pages/Movie";
import RegGroup from "./pages/RegGroup";
import AllGroups from "./pages/AllGroups";
import OwnGroups from "./pages/OwnGroups";
import Search from "./pages/Search";
import ShowTimes from "./pages/ShowTimes";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import UserProvider from "./context/UserProvider";
import { useTheme } from './context/ThemeContext';
import Ratings from "./pages/Ratings";

function App() {
  const { theme } = useTheme();

  return (
    <UserProvider>
      <div className="site-container" data-theme={theme}>
      <Navbar></Navbar>
      <div className="container">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/:username/favorites" element={<UserFavorite />} />
          <Route path="/grouppage/:groupName" element={<GroupPage />} />
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/reggroup" element={<RegGroup />} />
          <Route path="/allgroups" element={<AllGroups />} />
          <Route path="/owngroups" element={<OwnGroups />} />
          <Route path="/search" element={<Search />} />
          <Route path="/showtimes" element={<ShowTimes />} />
          <Route path="/adminpage" element = {<AdminPage />} />
          <Route path="/ratings" element ={<Ratings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer></Footer>
      </div>
    </UserProvider>
  );
}

export default App;
