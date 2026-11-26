import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <section>
      <h2>Espace Administrateur</h2>

      <nav className="admin-navigation" aria-label="Navigation administrateur">
        <NavLink to="/admin" end>
          Accueil
        </NavLink>

        <NavLink to="/admin/users">
          Utilisateurs
        </NavLink>

        <NavLink to="/admin/courses">
          Catalogue
        </NavLink>
      </nav>

      <Outlet />
    </section>
  );
}

export default AdminLayout;