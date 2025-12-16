import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import AppForm from "./pages/AppForm";
import EditForm from "./pages/EditForm";
import Schedules from "./pages/Schedules";
import Navigation from "./components/NavigationBar";



function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<AppForm />} />
          <Route path="/edit/:id" element={<EditForm />} />
          <Route path="/schedules" element={<Schedules />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
