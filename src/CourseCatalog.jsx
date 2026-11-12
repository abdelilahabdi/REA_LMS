import CourseCard from "./components/CourseCard";
import { useState  } from "react";
import CourseDetails from "./components/CourseDetails";
const courses = [
  {
    id: 1,
    title: "les bases de React",
    category: "Développement web",
    level: "Débutant",
  },
  {
    id: 2,
    title: "les bases de JavaScript",
    category: "Programmation",
    level: "Débutant",
  },
  {
    id:3,
    title:"les base de html",
    category:"Développement web",
    level: "Débutant",
  },
  {
    id: 4 ,
    title: "CSS",
    category: "Développement web",
    level: "Débutant",
  },
];
function CourseCatalog() {

  const [category, setCategory] = useState("Tous");
 
  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setSelectedId(null);
  }

  const filteredCourses = courses.filter(function (course) {
    if (category === "Tous") {
      return true ;
    }
    return course.category === category;
  })

  const [selectedId, setSelectedId] = useState(null);

  function handleSelectCourse(id) {
    setSelectedId(id);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  const selectedCourse = courses.find(function (course) {
    return course.id === selectedId ;
  }) ;
  return (
    <main>
      <h1>EduLearn LMS</h1>
      <p>Bienvenue sur notre plateforme de formation</p>

      <section>
        <h2>Catalogue des cours</h2>
        <p>Nombre de cours : {filteredCourses.length}</p>

        <label htmlFor="category">Catégorie :</label>

        <select  
        id="category"
        value={category}
        onChange={handleCategoryChange}
        >
          <option value="Tous">Toutes les catégories</option>
          <option value="Développement web">Développement web</option>
          <option value="Programmation">Programmation</option>
          <option value="Design">Design</option>
        </select>
        <p>Données de démonstration</p>
        {filteredCourses.length === 0 && (
          <p>Aucun cours dans cette catégorie</p>
        )}
        {filteredCourses.map(function(course) {
          return (
            <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            category={course.category}
            level={course.level}
            onSelectCourse={handleSelectCourse}
            />
          );
        })}
        
      </section>
      {selectedCourse && (
         <CourseDetails
         course = {selectedCourse}
         onClose = {handleCloseDetails}
         />
      )}
    </main>
  );
}

export default CourseCatalog() ;