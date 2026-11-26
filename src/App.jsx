import { useNavigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import useAuth from "./hooks/useAuth";

function App() {
  const { isLoading, restoreError, logout } = useAuth();
  const navigate = useNavigate();

  function handleRetry() {
    window.location.reload();
  }

  function handleReturnToLogin() {
    logout();
    navigate("/login", { replace: true });
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

        <button type="button" onClick={handleReturnToLogin}>
          Revenir à la connexion
        </button>
      </main>
    );
  }

  return <AppRouter />;
}

export default App;