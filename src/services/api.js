import axios from "axios" ;


const API_URL = "http://localhost:3000/api";



function prepareApiError (error , defaultMessage) {
  if (axios.isCancel(error)) {
    return error ;
  }

  if (error.response) {
    let message = defaultMessage;

    const result = error.response.data;

    if (result && typeof result.message === "string") {
      message = result.message;
    }


    const apiError = new Error(message, {cause: error});
    apiError.status = error.response.status;

    return apiError ;
  }

  if (error.request) {
    return new TypeError("connexion au serveur impossible", {
      cause: error,
    });
  }
 return error;

}
export async function loginUser(email, password) {

  try {
    const response = await axios.post(API_URL + "/auth/login", {
        email : email ,
        password : password ,
    });

    const result = response.data;

    if(!result || !result.data || !result.data.token) {
        throw new Error("Reponse de connexion invalide");
    }
    return result.data;
    
}catch (error) {
  throw prepareApiError (error, "connexion impossible");
 }
}

export async function getMyProfile (token) {

  try {
    const response = await axios.get(API_URL + "/auth/me" , {
        headers: {
            Authorization : "Bearer " + token,
        },
    });

    const result = response.data;

    if (!result || !result.data || !result.data.role ) {
         throw new Error("Réponse du profil invalide.");
        
    }
    return result.data ;
} catch (error) {
     throw prepareApiError(error, "Impossible de charger le profil.");
}
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



async function adminCourseRequest(token, path, method, values) {
  const options = {
    method: method,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  if (values !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(values);
  }

  const response = await fetch(
    API_URL + "/admin/courses" + path,
    options
  );

  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    const error = new Error(
      result && result.message
        ? result.message
        : "Impossible de traiter la demande."
    );

    error.status = response.status;
    throw error;
  }

  if (!result || result.data === undefined) {
    throw new Error("Réponse du serveur invalide. Rechargez la liste.");
  }

  return result.data;
}

export async function getAdminCourses(token) {
  const courses = await adminCourseRequest(token, "", "GET");

  if (!Array.isArray(courses)) {
    throw new Error("Liste des cours invalide.");
  }

  return courses;
}

export async function saveCourse(token, courseId, values) {
  const path = courseId ? "/" + courseId : "";
  const method = courseId ? "PUT" : "POST";

  const course = await adminCourseRequest(token, path, method, values);

  if (!course || !course._id) {
    throw new Error("Réponse du serveur invalide. Rechargez la liste.");
  }

  return course;
}

export async function changeCourseStatus(token, courseId, status) {
  const course = await adminCourseRequest(
    token,
    "/" + courseId + "/status",
    "PATCH",
    { status: status }
  );

  if (!course || !course._id) {
    throw new Error("Réponse du serveur invalide. Rechargez la liste.");
  }

  return course;
}