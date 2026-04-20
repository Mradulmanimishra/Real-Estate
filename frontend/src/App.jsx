import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import BuyPage from './Components/Buy/BuyPage';
import SellPage from './Components/Sell/SellPage';
import PropertyDetail from './Components/Buy/PropertyDetail';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import RequireAuth from './utils/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public — only login/signup is accessible without auth */}
        <Route path="/login" element={<Login />} />

        {/* Everything else requires login */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/buy" element={<RequireAuth><BuyPage /></RequireAuth>} />
        <Route path="/sell" element={<RequireAuth><SellPage /></RequireAuth>} />
        <Route path="/property/:id" element={<RequireAuth><PropertyDetail /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/favourites" element={<RequireAuth><Dashboard /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;