import React from 'react';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Register from './pages/Register';
import ClientDashboard from './pages/Dashbords/ClientDashboard';
import EmployeeDashboard from './pages/Dashbords/EmployeeDashboard';
import AdminDashboard from './pages/Dashbords/AdminDashboard';
import Regle from './pages/Regle';
import Game from './pages/Game/Game';
import About from './pages/About';

const routes = [
  <Route key="/" path="/" element={<Home />} />,
  <Route key="/login" path="/login" element={<Login />} />,
  <Route key="/profil" path="/profil" element={<Profile />} />,
  <Route key="/contact" path="/contact" element={<Contact />} />,
  <Route key="/register" path="/register" element={<Register />} />,
  <Route key="/clientdashboard" path="/clientdashboard" element={<ClientDashboard />} />,
  <Route key="/employeedashboard" path="/employeedashboard" element={<EmployeeDashboard />} />,
  <Route key="/admindashboard" path="/admindashboard" element={<AdminDashboard />} />,
  <Route key="/reglement" path="/reglement" element={<Regle />} />,
  <Route key="/game" path="/game" element={<Game />} />,
  <Route key="/about" path="/about" element={<About />} />,
];

export default routes;
