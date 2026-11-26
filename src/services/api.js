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

export async function getMyProfile (token , signal) {

  try {
    const response = await axios.get(API_URL + "/auth/me" , {
        headers: {
            Authorization : "Bearer " + token,
        },
        signal: signal,
        timeout: 15000,
    });

    const result = response.data;

    if (!result || !result.data || !result.data.id || !result.data.role ) {
         throw new Error("Réponse du profil invalide.");
        
    }
    return result.data ;
} catch (error) {
     throw prepareApiError(error, "Impossible de charger le profil.");
}
}


export async function getCourses(params = {} , signal) {
  try {
  const response = await axios.get(API_URL + "/courses", {
    params: params,
    signal: signal,
    timeout: 15000,
  });

  const result = await response.data;

  if (!result || !Array.isArray(result.data)) {
     throw new Error("Le serveur a renvoyé une liste de cours invalide.");
  }
    
 return result.data;
} catch (error) {
  throw prepareApiError(error, "Impossible de charger les cours.");
}
}

  

export async function getMyEnrollments(token) {
  try {
  const response = await axios.get(API_URL + "/enrollments/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  
  const result = response.data ;
  

  if (!Array.isArray(result)) {
    throw new Error("Le serveur a renvoyé une liste d'inscriptions invalide.");
    }
    return result;

} catch (error) {
    throw prepareApiError(error, "Impossible de charger vos inscriptions.");
  }
}


export async function getUsers(token) {
  try {
  const response = await axios.get(API_URL + "/users", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

 const result = response.data ;

  if (!result || !Array.isArray(result.data)) {
    throw new Error("Le serveur a renvoyé une liste d'utilisateurs invalide.");
  }

  return result.data;
  } catch (error) {
    throw prepareApiError(error, "Impossible de charger les utilisateurs.");
  }
}


export async function saveUser(token, userId, values) {
  let path = "/users";
  let method = "POST";

  if (userId) {
    path = "/users/" + userId;
    method = "PUT";
  }
   
  try {
    const response = await axios({
      url: API_URL + path,
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      data: values,
    });

    const result = response.data;

    if (!result || !result.data || !result.data._id) {
      throw new Error("Réponse du serveur invalide. Rechargez la liste.");
    }

    return result.data;
  } catch (error) {
    throw prepareApiError(error, "Impossible d'enregistrer cet utilisateur.");
  }
}



async function adminCourseRequest(token, path, method, values) {
  try {
   const response = await axios({
      url: API_URL + "/admin/courses" + path,
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      data: values,
    });

    const result = response.data;

    if (!result || result.data === undefined) {
      throw new Error("Réponse du serveur invalide. Rechargez la liste.");
    }

    return result.data;
  } catch (error) {
    throw prepareApiError(error, "Impossible de traiter la demande.");
  }
}

export async function getAdminCourses(token) {
  const courses = await adminCourseRequest(token, "", "GET");

  if (!Array.isArray(courses)) {
    throw new Error("Liste des cours invalide.");
  }

  return courses;
}

export async function saveCourse(token, courseId, values) {
  let path =  "";
  let method =  "POST";

  if (courseId) {
    path = "/" + courseId;
    method = "PUT";
  }

  const course = await adminCourseRequest(
    token,
    path,
    method,
    values
  );

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


export async function  getCourseById(courseId , signal) {
  try {
    const response = await axios.get(
      API_URL + "/courses/" + encodeURIComponent(courseId),

      {
        signal: signal,
        timeout: 15000,
      }
    );

    const result = response.data;

    if(!result || !result.data || !result.data._id) {
      throw new Error("les détails du cours sont invalides") ;
    }

    return result.data;
  }catch (error) {
    throw prepareApiError(error , "impossible de charger les détails du cours");

  }
}