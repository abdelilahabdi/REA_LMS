import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../services/api";

function CourseDetails({ courseId }) {
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    const controller = new AbortController();

    async function loadCourse() {
      try {
        const loadedCourse = await getCourseById(
          courseId,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setCourse(loadedCourse);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error.status === 404 || error.status === 400) {
          setError("Cours introuvable ou identifiant invalide.");
        } else {
          setError(error.message || "Impossible de charger le cours.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCourse();

    return function () {
      controller.abort();
    };
  }, [courseId]);

  if (isLoading) {
    return <p role="status">Chargement du cours...</p>;
  }

  if (error !== "") {
    return <p role="alert">{error}</p>;
  }

  if (course === null) {
    return <p>Cours introuvable.</p>;
  }

  const levelLabels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return (
    <article>
      <h1>{course.title}</h1>

      <p>{course.description}</p>
      <p>Catégorie : {course.category}</p>
      <p>Niveau : {levelLabels[course.level] || course.level}</p>
      <p>Durée estimée : {course.estimatedDuration}</p>

      {Array.isArray(course.objectives) &&
        course.objectives.length > 0 && (
          <section>
            <h2>Objectifs de la formation</h2>

            <ul>
              {course.objectives.map(function (objective, index) {
                return <li key={index}>{objective}</li>;
              })}
            </ul>
          </section>
        )}
    </article>
  );
}

function CourseDetailPage() {
 const { courseId } = useParams();
  const [attempt, setAttempt] = useState(0);

  function handleReload() {
    setAttempt(function (currentAttempt) {
      return currentAttempt + 1;
    });
  }

  return (
    <main>
      <Link to="/courses">Retour au catalogue</Link>

      <CourseDetails
       key={courseId + "-" + attempt}
       courseId={courseId}
       />

      <button type="button" onClick={handleReload}>
        Recharger les détails
      </button>
    </main>
  );
}

export default CourseDetailPage;