import { useState } from "react";
import { getMyEnrollments } from "../services/api";

function LearnerLayout(props) {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  async function handleLoadEnrollments() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setHasLoaded(false);
    setEnrollments([]);

    try {
      const loadedEnrollments = await getMyEnrollments(props.token);

      setEnrollments(loadedEnrollments);
      setHasLoaded(true);
    } catch (error) {
      if (error.status === 401) {
        props.onSessionExpired();
      } else if (error.status === 403) {
        setError("Accès refusé.");
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
      <h2>Espace Apprenant</h2>
      <h3>Mes cours</h3>

      <button
        type="button"
        onClick={handleLoadEnrollments}
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Charger mes cours"}
      </button>

      {isLoading && (
        <p role="status">Chargement de vos inscriptions...</p>
      )}

      {error !== "" && (
        <p role="alert">{error}</p>
      )}

      {!hasLoaded && !isLoading && error === "" && (
        <p>Cliquez sur le bouton pour consulter vos cours.</p>
      )}

      {hasLoaded && enrollments.length === 0 && (
        <p>
          Vous n'avez aucune inscription pour le moment.
          Contactez votre formateur pour rejoindre une formation.
        </p>
      )}

      {hasLoaded && enrollments.length > 0 && (
        <div>
          <p>Nombre d'inscriptions : {enrollments.length}</p>

          {enrollments.map(function (enrollment) {
            const course = enrollment.course;

            return (
              <article key={enrollment._id}>
                {course ? (
                  <div>
                    <h4>{course.title}</h4>
                    <p>Catégorie : {course.category}</p>
                    <p>Niveau : {course.level}</p>
                  </div>
                ) : (
                  <h4>Cours indisponible</h4>
                )}

                <p>Statut de l'inscription : {enrollment.status}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default LearnerLayout;