import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import HappyPoints from './pages/HappyPoints';
import Admin from './pages/Admin';
import RestaurantDetails from './pages/RestaurantDetails';

import { ReservationProvider } from './context/ReservationContext';

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter basename="/terramarya-demo/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Booking />} />
          <Route path="/restaurante/:id" element={<RestaurantDetails />} />
          <Route path="/puntos" element={<HappyPoints />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ReservationProvider>
  );
}

export default App;
