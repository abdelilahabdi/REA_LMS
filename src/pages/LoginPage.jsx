import { Navigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { isAuthenticated, user, sessionMessage } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const requestedPage = location.state?.from;

    if (
      typeof requestedPage === "string" &&
      requestedPage.startsWith("/") &&
      !requestedPage.startsWith("//") &&
      requestedPage !== "/login"
    ) {
      return <Navigate to={requestedPage} replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "learner") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "trainer") {
      return <Navigate to="/trainer/courses" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <main>
      {sessionMessage !== "" && (
        <p role="alert">{sessionMessage}</p>
      )}

      <LoginForm />
    </main>
  );
}

export default LoginPage;