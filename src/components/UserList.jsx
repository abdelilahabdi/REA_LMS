function UserList(props) {
  return (
    <div>
      {props.users.map(function (user) {
        return (
          <article key={user._id}>
            <h4>{user.name}</h4>
            <p>Email : {user.email}</p>
            <p>Rôle : {user.role}</p>
            <p>Statut : {user.status}</p>

            <button
              type="button"
              onClick={function () {
                props.onSelectUser(user._id);
              }}
              aria-pressed={props.selectedId === user._id}
            >
              Voir les détails
            </button>
          </article>
        );
      })}
    </div>
  );
}

export default UserList;