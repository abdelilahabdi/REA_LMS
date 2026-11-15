import { useState } from "react";

function UserForm(props) {
  const initialData = props.initialData;
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData ? initialData.name : "");
  const [email, setEmail] = useState(initialData ? initialData.email : "");
  const [status, setStatus] = useState(
    initialData ? initialData.status : "active"
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const nextErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "Le nom doit contenir au moins 2 caractères.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Adresse email invalide.";
    }

    if (!isEditing && password.length < 8) {
      nextErrors.password = "Minimum 8 caractères.";
    }

    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const values = {
      name: name.trim(),
      email: email.trim(),
      status: status,
    };

    if (!isEditing) {
      values.password = password;
    }

    setIsSaving(true);

    try {
      await props.onSubmit(values);
    } catch (error) {
      if (error.status === 403) {
        setApiError("Accès refusé.");
      } else if (error instanceof TypeError) {
        setApiError("Connexion au serveur impossible.");
      } else {
        setApiError(error.message);
      }
    } finally {
      setPassword("");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3>{isEditing ? "Modifier l'apprenant" : "Nouvel apprenant"}</h3>

      <div>
        <label htmlFor="account-name">Nom</label>
        <input
          id="account-name"
          value={name}
          onChange={function (event) {
            setName(event.target.value);
          }}
          disabled={isSaving}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "account-name-error" : undefined}
        />
        {errors.name && (
          <p id="account-name-error" role="alert">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="account-email">Email</label>
        <input
          id="account-email"
          type="email"
          value={email}
          onChange={function (event) {
            setEmail(event.target.value);
          }}
          disabled={isSaving}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "account-email-error" : undefined}
        />
        {errors.email && (
          <p id="account-email-error" role="alert">{errors.email}</p>
        )}
      </div>

      {!isEditing && (
        <div>
          <label htmlFor="account-password">Mot de passe</label>
          <input
            id="account-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={function (event) {
              setPassword(event.target.value);
            }}
            disabled={isSaving}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "account-password-error" : undefined
            }
          />
          {errors.password && (
            <p id="account-password-error" role="alert">
              {errors.password}
            </p>
          )}
          <p>Après une tentative d'envoi, le mot de passe est effacé.</p>
        </div>
      )}

      <div>
        <label htmlFor="account-status">Statut</label>
        <select
          id="account-status"
          value={status}
          onChange={function (event) {
            setStatus(event.target.value);
          }}
          disabled={isSaving}
        >
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>

      {apiError && <p role="alert">{apiError}</p>}

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </button>

      <button
        type="button"
        onClick={props.onCancel}
        disabled={isSaving}
      >
        Annuler
      </button>
    </form>
  );
}

export default UserForm;