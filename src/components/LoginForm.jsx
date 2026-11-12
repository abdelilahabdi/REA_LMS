import { useState } from "react";
import { loginUser , getMyProfile } from "../services/api";

function loginForm(props) {
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
            setError("email et mot de passe obligatoires") ;
            return;
        }

        setIsLoading(true);

        try {
            const loginData = await loginUser(email.trim(), password);

            setPassword("");

            const user = await getMyProfile(loginData.token);

            props.onLogin({
                token: loginData.token,
                user: user,
            });

        } catch (error) {
            if (error.status === 401) {
                setError("email ou mot de passe incorrect");
            } else if (error.status === 403) {
                setError("acces refuse : compte suspendu ");
            } else if (error instanceof TypeError) {
                setError("connexion au server impossible") ;
            } else {
                setError(error.message);
            }
        } finally {
            setPassword("");
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

export default loginForm;