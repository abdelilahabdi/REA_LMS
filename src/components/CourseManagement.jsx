import { useState } from "react";
import {
  getAdminCourses,
  getUsers,
  saveCourse,
  changeCourseStatus,
} from "../services/api";
import CourseForm from "./CourseForm";

function CourseManagement(props) {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const isBusy = isLoading || isChangingStatus || isFormOpen;

  const trainers = users.filter(function (user) {
    return user.role === "trainer" && user.status === "active";
  });

  const categories = [];

  for (const course of courses) {
    if (!categories.includes(course.category)) {
      categories.push(course.category);
    }
  }

  const filteredCourses = courses.filter(function (course) {
    const matchesCategory = category === "" || course.category === category;
    const matchesStatus = status === "" || course.status === status;

    return matchesCategory && matchesStatus;
  });

  const selectedCourse = courses.find(function (course) {
    return course._id === selectedId;
  });

  function getErrorMessage(error) {
    if (error.status === 401) {
      props.onSessionExpired();
      return "Session expirée.";
    }

    if (error.status === 403) {
      return "Accès refusé.";
    }

    if (error instanceof TypeError) {
      return "Connexion au serveur impossible.";
    }

    return error.message;
  }

  async function handleLoad() {
    if (isBusy) {
      return;
    }

    setIsLoading(true);
    setHasLoaded(false);
    setError("");
    setSuccess("");
    setCourses([]);
    setUsers([]);
    setSelectedId(null);

    try {
      const results = await Promise.all([
        getAdminCourses(props.token),
        getUsers(props.token),
      ]);

      setCourses(results[0]);
      setUsers(results[1]);
      setCategory("");
      setStatus("");
      setHasLoaded(true);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreate() {
    setEditingCourse(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function handleEdit() {
    setEditingCourse(selectedCourse);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingCourse(null);
  }

  function updateCourseInList(savedCourse) {
    setCourses(function (currentCourses) {
      return currentCourses.map(function (course) {
        return course._id === savedCourse._id ? savedCourse : course;
      });
    });

    setCategory("");
    setStatus("");
    setSelectedId(savedCourse._id);
  }

  async function handleSave(values) {
    setSuccess("");

    try {
      const courseId = editingCourse ? editingCourse._id : null;
      const savedCourse = await saveCourse(
        props.token,
        courseId,
        values
      );

      if (courseId) {
        updateCourseInList(savedCourse);
      } else {
        setCourses(function (currentCourses) {
          return [savedCourse, ...currentCourses];
        });

        setCategory("");
        setStatus("");
        setSelectedId(savedCourse._id);
      }

      setIsFormOpen(false);
      setEditingCourse(null);
      setSuccess(courseId ? "Cours modifié." : "Cours créé en brouillon.");
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error,
      });
    }
  }

  async function handleStatusChange(newStatus) {
    if (!selectedCourse || isBusy) {
      return;
    }

    let question = "Publier ce cours ?";

    if (newStatus === "draft") {
      question = "Remettre ce cours en brouillon et le retirer du catalogue public ?";
    } else if (newStatus === "archived") {
      question = "Archiver ce cours et le retirer du catalogue public ?";
    }

    if (!window.confirm(question)) {
      return;
    }

    setIsChangingStatus(true);
    setError("");
    setSuccess("");

    try {
      const savedCourse = await changeCourseStatus(
        props.token,
        selectedCourse._id,
        newStatus
      );

      updateCourseInList(savedCourse);
      setSuccess("Statut confirmé : " + savedCourse.status);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsChangingStatus(false);
    }
  }

  return (
    <section>
      <h3>Gestion du catalogue</h3>

      <button type="button" onClick={handleLoad} disabled={isBusy}>
        {isLoading ? "Chargement..." : "Charger les cours"}
      </button>

      {hasLoaded && (
        <button type="button" onClick={handleCreate} disabled={isBusy}>
          Ajouter un cours
        </button>
      )}

      {isLoading && <p role="status">Chargement du catalogue...</p>}
      {isChangingStatus && <p role="status">Modification du statut...</p>}
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      {!hasLoaded && !isLoading && !error && (
        <p>Cliquez sur le bouton pour charger le catalogue.</p>
      )}

      {isFormOpen && (
        <CourseForm
          key={editingCourse ? editingCourse._id : "new"}
          initialData={editingCourse}
          trainers={trainers}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
      )}

      {hasLoaded && (
        <div>
          <div className="user-filters">
            <div>
              <label htmlFor="admin-course-category">Catégorie</label>
              <select
                id="admin-course-category"
                value={category}
                disabled={isBusy}
                onChange={function (event) {
                  setCategory(event.target.value);
                  setSelectedId(null);
                }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(function (item) {
                  return <option key={item} value={item}>{item}</option>;
                })}
              </select>
            </div>

            <div>
              <label htmlFor="admin-course-status">Statut</label>
              <select
                id="admin-course-status"
                value={status}
                disabled={isBusy}
                onChange={function (event) {
                  setStatus(event.target.value);
                  setSelectedId(null);
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          <p>Nombre de cours : {filteredCourses.length}</p>

          {courses.length === 0 && <p>Aucun cours. Ajoutez votre premier cours.</p>}

          {courses.length > 0 && filteredCourses.length === 0 && (
            <p>Aucun cours ne correspond aux filtres.</p>
          )}

          <div className="users-layout">
            <div>
              {filteredCourses.map(function (course) {
                return (
                  <article key={course._id}>
                    <h4>{course.title}</h4>
                    <p>Catégorie : {course.category}</p>
                    <p>Niveau : {course.level}</p>
                    <p>Statut : {course.status}</p>
                    <p>
                      Formateur : {course.trainer
                        ? course.trainer.name
                        : "Indisponible"}
                    </p>

                    <button
                      type="button"
                      disabled={isBusy}
                      aria-pressed={selectedId === course._id}
                      onClick={function () {
                        setSelectedId(course._id);
                      }}
                    >
                      Voir les détails
                    </button>
                  </article>
                );
              })}
            </div>

            {selectedCourse && (
              <aside className="user-details" aria-label="Détails du cours">
                <h3>{selectedCourse.title}</h3>
                <p>{selectedCourse.description}</p>
                <p>Durée estimée : {selectedCourse.estimatedDuration}</p>
                <p>Statut : {selectedCourse.status}</p>

                <p>
                  Objectifs : {(selectedCourse.objectives || []).join(" ; ") || "Non précisés"}
                </p>

                <button type="button" onClick={handleEdit} disabled={isBusy}>
                  Modifier
                </button>

                {selectedCourse.status !== "published" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={function () {
                      handleStatusChange("published");
                    }}
                  >
                    Publier
                  </button>
                )}

                {selectedCourse.status !== "draft" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={function () {
                      handleStatusChange("draft");
                    }}
                  >
                    Remettre en brouillon
                  </button>
                )}

                {selectedCourse.status !== "archived" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={function () {
                      handleStatusChange("archived");
                    }}
                  >
                    Archiver
                  </button>
                )}

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={function () {
                    setSelectedId(null);
                  }}
                >
                  Fermer
                </button>
              </aside>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CourseManagement;