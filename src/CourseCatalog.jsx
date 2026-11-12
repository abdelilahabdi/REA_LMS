import { useState } from "react";
import CourseCard from "./components/CourseCard";
import CourseDetails from "./components/CourseDetails";
import { getCourses } from "./services/api";

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("Tous");
  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  async function handleLoadCourses() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setHasLoaded(false);
    setCourses([]);
    setSelectedId(null);

    try {
      const loadedCourses = await getCourses();

      setCourses(loadedCourses);
      setCategory("Tous");
      setHasLoaded(true);
    } catch (error) {
      if (error instanceof TypeError) {
        setError("Connexion au serveur impossible.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setSelectedId(null);
  }

  function handleSelectCourse(id) {
    setSelectedId(id);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  // Catégories calculées à partir des cours reçus.
  const categories = [];

  for (const course of courses) {
    if (!categories.includes(course.category)) {
      categories.push(course.category);
    }
  }

  const filteredCourses = courses.filter(function (course) {
    if (category === "Tous") {
      return true;
    }

    return course.category === category;
  });

  const selectedCourse = courses.find(function (course) {
    return course._id === selectedId;
  });

  return (
    <div>
      <section>
        <h2>Catalogue des cours</h2>
        <p>Cette liste contient uniquement les cours publiés.</p>

        <button
          type="button"
          onClick={handleLoadCourses}
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Charger les cours"}
        </button>

        {isLoading && (
          <p role="status">Chargement des cours en cours...</p>
        )}

        {error !== "" && (
          <p role="alert">{error}</p>
        )}

        {!hasLoaded && !isLoading && error === "" && (
          <p>Cliquez sur le bouton pour charger les cours.</p>
        )}

        {hasLoaded && (
          <div>
            <label htmlFor="category">Catégorie :</label>

            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="Tous">Toutes les catégories</option>

              {categories.map(function (courseCategory) {
                return (
                  <option
                    key={courseCategory}
                    value={courseCategory}
                  >
                    {courseCategory}
                  </option>
                );
              })}
            </select>

            <p>Nombre de cours : {filteredCourses.length}</p>

            {courses.length === 0 && (
              <p>Aucun cours publié pour le moment.</p>
            )}

            {courses.length > 0 && filteredCourses.length === 0 && (
              <p>Aucun cours dans cette catégorie.</p>
            )}

            {filteredCourses.map(function (course) {
              return (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  category={course.category}
                  level={course.level}
                  onSelectCourse={handleSelectCourse}
                />
              );
            })}
          </div>
        )}
      </section>

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default CourseCatalog;