import { Outlet, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import useAuth from "../hooks/useAuth";

function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <Outlet />
    </AppShell>
  );
}

export default AuthenticatedLayout;