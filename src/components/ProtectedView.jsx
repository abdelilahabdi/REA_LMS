function ProtectedView(props) {
    if (!props.session || !props.session.user) {
        return <p>Connexion obligatoire </p>;
    }

    const role = props.session.user.role;
    const isAllowed = props.allowedRoles.includes(role);


    if(!isAllowed) {
        return <p role="alert">Acces refusé</p>;
    }

    return props.children ;
}

export default ProtectedView ;