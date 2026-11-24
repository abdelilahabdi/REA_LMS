import CourseManagement from "../components/CourseManagement";
import UserManagement from "../components/UserManagement";

function AdminLayout(props) {
  function showHome() {
    props.onNavigate("home"); // kaywesel valeur home l function handleNavigate li kayna f app 7it rebtnahom haka <AdminLayout onNavigate={handleNavigate} />
  }

  function showUsers() {
    props.onNavigate("users"); // mli admin layout kayekteb props.onNavigate("users"); rah kaye3eyet l function handleNavigate li f app w kay3tiha "users"

  }

  function showCourses() {
    props.onNavigate("courses");
  }

  return (
    <section>
      <h2>Espace Administrateur</h2>
       <p>class actuelle : {props.currentView}</p>
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

      {props.currentView === "users" && (  // condition kayl9a "users" w kaybyen mostakhdimin  // ila l9ima li weslat hya "users"  beyen usermanagement w nefes chi kaywe9e3 le2azrar lekhrin ghir 9ima katkhetalf // 9ima li katsefet "home" "users" "courses" function f adminLayout showhome showusers showcourses // zir li deghety 3lih aaccueil utilisateurs catalogue  
        <UserManagement   
          token={props.token}
          onSessionExpired={props.onSessionExpired}
        />
      )}

      {props.currentView === "courses" && (
        <CourseManagement
        token={props.token}
        onSessionExpired={props.onSessionExpired}
        />
      )}
    </section>
  );
}

export default AdminLayout;