import { useState } from "react";
//import { loginUser , getMyProfile } from "../services/api";
import useAuth from "../hooks/useAuth";
function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if(isLoading) {
            return;
        }

        setError("");

        if (email.trim() === "" || password === "") {
    setError("Email et mot de passe obligatoires.");
    return;
  }

  const submittedPassword = password;

  setPassword("");
  setIsLoading(true);

  try {
    await login(email.trim(), submittedPassword);
  } catch (error) {
    if (error.status === 401) {
      setError("Connexion refusée. Vérifiez vos identifiants.");
    } else if (error.status === 403) {
      setError("Accès refusé. " + error.message);
    } else if (error instanceof TypeError) {
      setError("Connexion au serveur impossible.");
    } else {
      setError(error.message);
    }
  } finally {
    setIsLoading(false);
  }
}
    

    return (
        <section>
            <h1>Connexion a EduLearn</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                     id="email"
                     type="email"
                     autoComplete="username"
                     value={email}
                     onChange={function (event) {
                        setEmail(event.target.value);
                     }}
                     disabled={isLoading}
                     required
                      />
                </div>

                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                       id="password"
                       type="password"
                       autoComplete="current-password"
                       value={password}
                       onChange={function (event) {
                        setPassword(event.target.value);
                       }}
                       disabled={isLoading}
                       required
                        />
                </div>

                {error !== "" && <p role="alert">{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "connexion en cours ..." : "se connecter"}
                </button>
            </form>
        </section>
    );
}

export default LoginForm;