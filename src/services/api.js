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