import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProtectedView from "./components/ProtectedView";
import AdminLayout from "./layouts/AdminLayout";
import LearnerLayout from "./layouts/LearnerLayout";
import AppShell from "./components/AppShell";
import useAuth from "./hooks/useAuth";

function App() {
  const [currentView, setCurrentView] = useState("home");

  const {
    session,
    user,
    token,
    isLoading,
    sessionMessage,
    restoreError,
    logout,
    expireSession,
  } = useAuth();

  function handleLogout() {
    setCurrentView("home");
    logout();
  }

  function handleSessionExpired() {
    setCurrentView("home");
    expireSession();
  }

  function handleNavigate(view) {
    setCurrentView(view);
  }

  function handleRetry() {
    window.location.reload();
  }

  if (isLoading) {
    return (
      <main>
        <p role="status">Vérification de votre session...</p>
      </main>
    );
  }

  if (restoreError !== "") {
    return (
      <main>
        <p role="alert">{restoreError}</p>

        <button type="button" onClick={handleRetry}>
          Réessayer
        </button>

        <button type="button" onClick={handleLogout}>
          Revenir à la connexion
        </button>
      </main>
    );
  }

  if (session === null) {
    return (
      <main>
        {sessionMessage !== "" && (
          <p role="alert">{sessionMessage}</p>
        )}

        <LoginForm />
      </main>
    );
  }

  const role = user.role;

  return (
    <AppShell user={user} onLogout={handleLogout}>
      {role === "admin" && (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <AdminLayout
            currentView={currentView}
            onNavigate={handleNavigate}
            token={token}
            onSessionExpired={handleSessionExpired}
          />
        </ProtectedView>
      )}

      {role === "learner" && (
        <ProtectedView session={session} allowedRoles={["learner"]}>
          <LearnerLayout
            token={token}
            onSessionExpired={handleSessionExpired}
          />
        </ProtectedView>
      )}

      {role !== "admin" && role !== "learner" && (
        <p role="alert">
          Aucun espace prévu pour votre rôle dans cette version.
        </p>
      )}
    </AppShell>
  );
}

export default App;