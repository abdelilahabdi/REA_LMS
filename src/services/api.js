const API_URL = "http://localhost:3000/api";

export async function loginUser(email, password) {
    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },

        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    const result = await response.json();

    if(!response.ok) {
        const error = new Error(result.message || "Connexion impossible");
        error.status = response.status;
        throw error;
    }
    return result.data;


    
}

export async function getMyProfile (token) {
    const response = await fetch (API_URL + "/auth/me" , {
        headers: {
            Authorization : "Bearer " + token,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(
            result.message || "Impossible de charger le profil"
        );
        error.status = response.status;
        throw error ;
    }
    return result.data ;
}


export async function getCourses() {
  const response = await fetch(API_URL + "/courses");
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "Impossible de charger les cours."
    );

    error.status = response.status;
    throw error;
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Le serveur a renvoyé une liste de cours invalide.");
  }

  return result.data;
}

export async function getMyEnrollments(token) {
  const response = await fetch(API_URL + "/enrollments/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  
  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    const message =
      result && result.message
        ? result.message
        : "Impossible de charger vos inscriptions.";

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  if (!Array.isArray(result)) {
    throw new Error("Le serveur a renvoyé une liste invalide.");
  }

  return result;
}

export async function getUsers(token) {
  const response = await fetch(API_URL + "/users", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    const message =
      result && result.message
        ? result.message
        : "Impossible de charger les utilisateurs.";

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  if (!result || !Array.isArray(result.data)) {
    throw new Error("Le serveur a renvoyé une liste invalide.");
  }

  return result.data;
}


export async function saveUser(token, userId, values) {
  let path = "/users";
  let method = "POST";

  if (userId) {
    path = "/users/" + userId;
    method = "PUT";
  }

  const response = await fetch(API_URL + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(values),
  });

  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    const error = new Error(
      result && result.message
        ? result.message
        : "Impossible d'enregistrer cet utilisateur."
    );

    error.status = response.status;
    throw error;
  }

  if (!result || !result.data || !result.data._id) {
    throw new Error("Réponse du serveur invalide. Rechargez la liste.");
  }

  return result.data;
}