function AppShell(props) {
  return (
    <main>
      <header className="app-header">
        <div>
          <h1>Bienvenue {props.user.name}</h1>
          <p>Email : {props.user.email}</p>
          <p>Rôle : {props.user.role}</p>
        </div>

        <button type="button" onClick={props.onLogout}>
          Déconnexion
        </button>
      </header>

      {props.children}
    </main>
  );
}

export default AppShell;