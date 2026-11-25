import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function useAuth() {
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return auth;
}

export default useAuth;