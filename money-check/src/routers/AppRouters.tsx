import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PrivateRoute from "../components/auth/PrivateRoute";
import PublicRoute from "../components/auth/PublicRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Incomes from "../pages/Incomes/Incomes";
import Expenses from "../pages/Expenses/Expenses";
import Budgets from "../pages/Budgets/Budgets";
import Analytics from "../pages/Analytics/Analytics";
import Goals from "../pages/Goals/Goals";
import Currency from "../pages/Currency/Currency";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;