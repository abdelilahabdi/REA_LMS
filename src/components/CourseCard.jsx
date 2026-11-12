function CourseCard(props) {
    function handleClick() {
        props.onSelectCourse(props.id);
    }

    return (
        <article className="course-card">
            <h3>{props.title}</h3>
            <p>Catégorie : {props.category}</p>
            <p>Niveau : {props.level}</p>

            <button type="button" onClick={handleClick}>
                Voir les détails
            </button>
        </article>
    );
}

export default CourseCard;