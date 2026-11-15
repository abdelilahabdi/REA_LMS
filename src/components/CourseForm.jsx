import { useState } from "react";

function CourseForm(props) {
  const course = props.initialData;

  const [values, setValues] = useState({
    title: course ? course.title : "",
    description: course ? course.description : "",
    category: course ? course.category : "",
    level: course ? course.level : "beginner",
    estimatedDuration: course ? String(course.estimatedDuration) : "",
    trainer: course
      ? (course.trainer && (course.trainer._id || course.trainer)) || ""
      : "",
    objectives: course ? (course.objectives || []).join("\n") : "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "Le titre est obligatoire.";
    }

    if (!values.description.trim()) {
      nextErrors.description = "La description est obligatoire.";
    }

    if (!values.category.trim()) {
      nextErrors.category = "La catégorie est obligatoire.";
    }

    const duration = Number(values.estimatedDuration);

    if (!Number.isFinite(duration) || duration < 1) {
      nextErrors.estimatedDuration = "La durée doit être au moins 1.";
    }

    const trainerExists = props.trainers.some(function (trainer) {
      return trainer._id === values.trainer;
    });

    if (!trainerExists) {
      nextErrors.trainer = "Choisissez un formateur actif.";
    }

    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const objectives = values.objectives
      .split("\n")
      .map(function (objective) {
        return objective.trim();
      })
      .filter(function (objective) {
        return objective !== "";
      });

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      level: values.level,
      estimatedDuration: duration,
      trainer: values.trainer,
      objectives: objectives,
    };

    setIsSaving(true);

    try {
      await props.onSubmit(payload);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3>{course ? "Modifier le cours" : "Nouveau cours"}</h3>

      <fieldset disabled={isSaving}>
        <legend>Informations du cours</legend>

        <label htmlFor="course-title">Titre</label>
        <input
          id="course-title"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
        />
        {errors.title && <p role="alert">{errors.title}</p>}

        <label htmlFor="course-description">Description</label>
        <textarea
          id="course-description"
          name="description"
          value={values.description}
          onChange={handleChange}
          required
        />
        {errors.description && (
          <p role="alert">{errors.description}</p>
        )}

        <label htmlFor="course-category">Catégorie</label>
        <input
          id="course-category"
          name="category"
          value={values.category}
          onChange={handleChange}
          required
        />
        {errors.category && <p role="alert">{errors.category}</p>}

        <label htmlFor="course-level">Niveau</label>
        <select
          id="course-level"
          name="level"
          value={values.level}
          onChange={handleChange}
        >
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>

        <label htmlFor="course-duration">Durée estimée</label>
        <input
          id="course-duration"
          name="estimatedDuration"
          type="number"
          min="1"
          step="any"
          value={values.estimatedDuration}
          onChange={handleChange}
          required
        />
        {errors.estimatedDuration && (
          <p role="alert">{errors.estimatedDuration}</p>
        )}

        <label htmlFor="course-trainer">Formateur</label>
        <select
          id="course-trainer"
          name="trainer"
          value={values.trainer}
          onChange={handleChange}
          required
        >
          <option value="">Choisir un formateur actif</option>
          {props.trainers.map(function (trainer) {
            return (
              <option key={trainer._id} value={trainer._id}>
                {trainer.name} — {trainer.email}
              </option>
            );
          })}
        </select>
        {errors.trainer && <p role="alert">{errors.trainer}</p>}

        {props.trainers.length === 0 && (
          <p>Aucun formateur actif disponible.</p>
        )}

        <label htmlFor="course-objectives">
          Objectifs : un par ligne, facultatifs
        </label>
        <textarea
          id="course-objectives"
          name="objectives"
          value={values.objectives}
          onChange={handleChange}
        />

        {apiError && <p role="alert">{apiError}</p>}

        <button type="submit">
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>

        <button type="button" onClick={props.onCancel}>
          Annuler
        </button>
      </fieldset>
    </form>
  );
}

export default CourseForm;