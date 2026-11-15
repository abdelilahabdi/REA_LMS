import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProtectedView from "./components/ProtectedView";
import AdminLayout from "./layouts/AdminLayout";
import LearnerLayout from "./layouts/LearnerLayout";
import AppShell from "./components/AppShell";
function App() {
  const [session, setSession] = useState(null);
  const [currentView , setCurrentView] = useState("home");
  const [sessionMessage, setSessionMessage] = useState("");
  function handleLogin(newSession) {
    setSessionMessage("");
    setCurrentView("home");
    setSession(newSession);
  }

  function handleLogout() {
    setSession(null);
    setCurrentView("home");
    setSessionMessage("");
  }


  function handleSessionExpired() {
  setSession(null);
  setCurrentView("home");
  setSessionMessage("Votre session a expiré. Veuillez vous reconnecter.");
}


  function handleNavigate(view) {
  setCurrentView(view);
 }

  if (session === null) {
    return (
      <main>
        {sessionMessage !== "" && (
        <p role="alert">{sessionMessage}</p>
        )}
        
        <LoginForm onLogin={handleLogin} />
      </main>
    );
  }

  const role = session.user.role ;

  return (
    <AppShell user={session.user} onLogout={handleLogout}>

      {role === "admin" && (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <AdminLayout 
          currentView={currentView}
          onNavigate={handleNavigate}
          token={session.token}
          onSessionExpired={handleSessionExpired}
          />
          </ProtectedView>
      )}

      {role === "learner" && (
        <ProtectedView session={session} allowedRoles={["learner"]}>
          <LearnerLayout
          token={session.token}
          onSessionExpired={handleSessionExpired}
          />
        </ProtectedView>
      )}

      {role !== "admin" && role !== "learner" && (
        <p role="alert">
          Aucun espace prévu pour votre role dans cette version
        </p>
      )}

  
    </AppShell> 
    
  );
}




export default App;