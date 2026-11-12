function CourseDetails(props) {
    return (
        <section>
            <h2>Détails du cours</h2>

            <h3>{props.course.title}</h3>
            <p>Catégorie : {props.course.category}</p>
            <p>Niveau : {props.course.level}</p>

            <button type="button" onClick={props.onClose}>
                Fermer
            </button>
        </section>
    );
}

export default CourseDetails;