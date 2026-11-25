import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { loginUser, getMyProfile } from "../services/api";

const TOKEN_KEY = "edulearn_token";

function AuthProvider({ children }) {
  const [initialToken] = useState(function () {
    return sessionStorage.getItem(TOKEN_KEY);
  });

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(initialToken));
  const [sessionMessage, setSessionMessage] = useState("");
  const [restoreError, setRestoreError] = useState("");

  useEffect(function () {
    if (!initialToken) {
      return;
    }

    const controller = new AbortController();

    async function restoreSession() {
      try {
        const user = await getMyProfile(
          initialToken,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setSession({
          token: initialToken,
          user: user,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          setSessionMessage(
            "Votre session a expiré. Veuillez vous reconnecter."
          );
        } else if (error.status === 403) {
          setRestoreError("Accès refusé. " + error.message);
        } else {
          setRestoreError(
            "Impossible de vérifier votre session. " + error.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return function () {
      controller.abort();
    };
  }, [initialToken]);

  async function login(email, password) {
    const loginData = await loginUser(email, password);
    const user = await getMyProfile(loginData.token);

    sessionStorage.setItem(TOKEN_KEY, loginData.token);

    setSession({
      token: loginData.token,
      user: user,
    });

    setSessionMessage("");
    setRestoreError("");
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setSession(null);
    setSessionMessage("");
    setRestoreError("");
  }

  function expireSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    setSession(null);
    setRestoreError("");
    setSessionMessage(
      "Votre session a expiré. Veuillez vous reconnecter."
    );
  }

  let user = null;
  let token = null;

  if (session) {
    user = session.user;
    token = session.token;
  }

  const value = {
    session: session,
    user: user,
    token: token,
    isAuthenticated: session !== null,
    isLoading: isLoading,
    sessionMessage: sessionMessage,
    restoreError: restoreError,
    login: login,
    logout: logout,
    expireSession: expireSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;