import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProtectedView from "./components/ProtectedView";
import AdminLayout from "./layouts/AdminLayout";
import LearnerLayout from "./layouts/LearnerLayout";
function App() {
  const [session, setSession] = useState(null);
  const [currentView , setCurrentView] = useState("home");
  function handleLogin(newSession) {
    setCurrentView("home");
    setSession(newSession);
  }

  function handleLogout() {
    setSession(null);
    setCurrentView("home");
  }

  function handleNavigate(view) {
  setCurrentView(view);
 }

  if (session === null) {
    return (
      <main>
        <LoginForm onLogin={handleLogin} />
      </main>
    );
  }

  const role = session.user.role ;

  return (
    <main>
      <header>
        <h1>Bienvenue {session.user.name}</h1>

        <p>Email : {session.user.email}</p>
        <p>Rôle : {role}</p>

        <button type="button" onClick={handleLogout}>
          Déconnexion
        </button>
      </header>

      {role === "admin" && (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <AdminLayout 
          currentView={currentView}
          onNavigate={handleNavigate}
          />
          </ProtectedView>
      )}

      {role === "learner" && (
        <ProtectedView session={session} allowedRoles={["learner"]}>
          <LearnerLayout />
        </ProtectedView>
      )}

      {role !== "admin" && role !== "learner" && (
        <p role="alert">
          Aucun espace prévu pour votre role dans cette version
        </p>
      )}

  
    </main> 
    
  );
}




export default App;