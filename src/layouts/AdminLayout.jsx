import CourseCatalog from "../CourseCatalog";

function AdminLayout(props) {
  function showHome() {
    props.onNavigate("home");
  }

  function showUsers() {
    props.onNavigate("users");
  }

  function showCourses() {
    props.onNavigate("courses");
  }

  return (
    <section>
      <h2>Espace Administrateur</h2>

      <nav aria-label="Navigation administrateur">
        <button
          type="button"
          onClick={showHome}
          aria-pressed={props.currentView === "home"}
        >
          Accueil
        </button>

        <button
          type="button"
          onClick={showUsers}
          aria-pressed={props.currentView === "users"}
        >
          Utilisateurs
        </button>

        <button
          type="button"
          onClick={showCourses}
          aria-pressed={props.currentView === "courses"}
        >
          Catalogue
        </button>
      </nav>

      {props.currentView === "home" && (
        <p>Choisissez une rubrique dans le menu.</p>
      )}

      {props.currentView === "users" && (
        <div>
          <h3>Gestion des utilisateurs</h3>
          <p>Les utilisateurs ne sont pas encore chargés.</p>
        </div>
      )}

      {props.currentView === "courses" && (
        <CourseCatalog />
      )}
    </section>
  );
}

export default AdminLayout;