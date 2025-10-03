import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Scrims from './pages/Scrims';
import ScrimDetails from "./pages/ScrimsDetails";
import Tournaments from './pages/Tournaments';
import TournamentDetails from './pages/TournamentDetails';
import Calendario from './pages/Calendario';
import AdminPanel from './pages/admin/AdminLayout';
import CadastrarOrg from "./pages/CadastrarOrg";
import CadastroOrgForm from "./pages/CadastroOrgForm";
import CheckoutOrg from "./pages/CheckoutOrg";
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas normais com layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/scrims" element={<Scrims />} />
            <Route path="/scrims/:id" element={<ScrimDetails />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path='/cadastrar-org' element={<CadastrarOrg />} />
            <Route path="/cadastrar-org-form" element={<CadastroOrgForm />} />
            <Route path="/checkout-org" element={<CheckoutOrg />} />
          </Route>

          {/* Rota Admin protegida */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
