import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useCourseData from "../hooks/useCourseData";

function CatalogFilters({ category, level, keyword, sortBy, onSearch }) {
  const [values, setValues] = useState({
    category: category,
    level: level,
    keyword: keyword,
    sortBy: sortBy,
  });

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setValues(function (currentValues) {
      return {
        ...currentValues,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="catalog-keyword">Rechercher un cours</label>
        <input
          id="catalog-keyword"
          name="keyword"
          type="search"
          value={values.keyword}
          onChange={handleChange}
          placeholder="Exemple : Node"
        />
      </div>

      <div>
        <label htmlFor="catalog-category">Catégorie exacte</label>
        <input
          id="catalog-category"
          name="category"
          value={values.category}
          onChange={handleChange}
          placeholder="Exemple : Backend"
        />
      </div>

      <div>
        <label htmlFor="catalog-level">Niveau</label>
        <select
          id="catalog-level"
          name="level"
          value={values.level}
          onChange={handleChange}
        >
          <option value="">Tous les niveaux</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort">Trier par</label>
        <select
          id="catalog-sort"
          name="sortBy"
          value={values.sortBy}
          onChange={handleChange}
        >
          <option value="createdAt">Création la plus récente</option>
          <option value="publishedAt">Publication la plus récente</option>
        </select>
      </div>

      <button type="submit">Rechercher</button>
    </form>
  );
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const keyword = searchParams.get("keyword") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";

  const { courses, error, isLoading, reload } = useCourseData(
    category,
    level,
    keyword,
    sortBy
  );

  function handleSearch(values) {
    const params = new URLSearchParams();

    if (values.keyword.trim() !== "") {
      params.set("keyword", values.keyword.trim());
    }

    if (values.category.trim() !== "") {
      params.set("category", values.category.trim());
    }

    if (values.level !== "") {
      params.set("level", values.level);
    }

    params.set("sortBy", values.sortBy);
    setSearchParams(params);
  }

  function handleReset() {
    setSearchParams({});
  }

  const levelLabels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return (
    <main>
      <nav aria-label="Navigation catalogue">
        <Link to="/">Accueil</Link>
        {" · "}
        <Link to="/login">Mon espace / Connexion</Link>
      </nav>

      <h1>Catalogue des cours</h1>
      <p>Découvrez les formations publiées sur EduLearn.</p>

      <CatalogFilters
        key={searchParams.toString()}
        category={category}
        level={level}
        keyword={keyword}
        sortBy={sortBy}
        onSearch={handleSearch}
      />

      <button type="button" onClick={handleReset}>
        Réinitialiser les filtres
      </button>

      {isLoading && (
        <p role="status">Chargement des cours...</p>
      )}

      {error !== "" && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={reload}>
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && error === "" && (
        <section aria-label="Résultats du catalogue">
          <p role="status">Nombre de cours : {courses.length}</p>

          {courses.length === 0 && (
            <p>Aucun cours ne correspond à votre recherche.</p>
          )}

          {courses.map(function (course) {
            return (
              <article key={course._id} className="catalog-card">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <p>Catégorie : {course.category}</p>
                <p>
                  Niveau : {levelLabels[course.level] || course.level}
                </p>
                <Link to={"/courses/" + course._id}>
                   Voir les détails
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default CatalogPage; 