import { useState } from "react";
import { getUsers , saveUser } from "../services/api";
import UserList from "./UserList";
import UserForm from "./UserForm";
function UserManagement(props) {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");


  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [success, setSuccess] = useState("");

  async function handleLoadUsers() {
    if (isLoading || isFormOpen) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setIsFormOpen(false);
    setEditingUser(null);
    setHasLoaded(false);
    setUsers([]);
    setSelectedId(null);

    try {
      const loadedUsers = await getUsers(props.token);

      setUsers(loadedUsers);
      setRoleFilter("");
      setStatusFilter("");
      setHasLoaded(true);
    } catch (error) {
      if (error.status === 401) {
        props.onSessionExpired();
      } else if (error.status === 403) {
        setError("Accès refusé.");
      } else if (error instanceof TypeError) {
        setError("Connexion au serveur impossible.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleRoleChange(event) {
    setRoleFilter(event.target.value);
    setSelectedId(null);
  }

  function handleStatusChange(event) {
    setStatusFilter(event.target.value);
    setSelectedId(null);
  }

  function handleSelectUser(id) {
    setSelectedId(id);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  function handleCreateUser() {
  setEditingUser(null);
  setSuccess("");
  setIsFormOpen(true);
}

function handleEditUser() {
  setEditingUser(selectedUser);
  setSuccess("");
  setIsFormOpen(true);
}

function handleCancelForm() {
  setIsFormOpen(false);
  setEditingUser(null);
}

async function handleSaveUser(values) {
  setSuccess("");

  try {
    const userId = editingUser ? editingUser._id : null;
    const savedUser = await saveUser(props.token, userId, values);

    setUsers(function (currentUsers) {
      if (!userId) {
        return [savedUser, ...currentUsers];
      }

      return currentUsers.map(function (user) {
        if (user._id === savedUser._id) {
          return savedUser;
        }

        return user;
      });
    });

    setRoleFilter("");
    setStatusFilter("");
    setSelectedId(savedUser._id);
    setIsFormOpen(false);
    setEditingUser(null);
    setSuccess(userId ? "Apprenant modifié." : "Apprenant créé.");
  } catch (error) {
    if (error.status === 401) {
      props.onSessionExpired();
    }

    throw error;
  }
}

  const filteredUsers = users.filter(function (user) {
    const matchesRole =
      roleFilter === "" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "" || user.status === statusFilter;

    return matchesRole && matchesStatus;
  });

  const selectedUser = users.find(function (user) {
    return user._id === selectedId;
  });

  return (
    <section>
      <h3>Gestion des utilisateurs</h3>
       

       {success && <p role="status">{success}</p>}

{hasLoaded && !isFormOpen && (
  <button type="button" onClick={handleCreateUser}>
    Ajouter un apprenant
  </button>
)}

             {isFormOpen && (
             <UserForm
    key={editingUser ? editingUser._id : "new"}
    initialData={editingUser}
    onSubmit={handleSaveUser}
    onCancel={handleCancelForm}
                />
     )}



      <button
        type="button"
        onClick={handleLoadUsers}
        disabled={isLoading || isFormOpen}
      >
        {isLoading ? "Chargement..." : "Charger les utilisateurs"}
      </button>

      {isLoading && (
        <p role="status">Chargement des utilisateurs...</p>
      )}

      {error !== "" && (
        <p role="alert">{error}</p>
      )}

      {!hasLoaded && !isLoading && error === "" && (
        <p>Cliquez sur le bouton pour charger les utilisateurs.</p>
      )}

      {hasLoaded && (
        <div>
          <div className="user-filters">
            <div>
              <label htmlFor="user-role">Rôle</label>

              <select
                id="user-role"
                value={roleFilter}
                onChange={handleRoleChange}
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="learner">Learner</option>
              </select>
            </div>

            <div>
              <label htmlFor="user-status">Statut</label>

              <select
                id="user-status"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>

          <p>Nombre d'utilisateurs : {filteredUsers.length}</p>

          {users.length === 0 && (
            <p>Aucun utilisateur enregistré.</p>
          )}

          {users.length > 0 && filteredUsers.length === 0 && (
            <p>Aucun utilisateur ne correspond aux filtres.</p>
          )}

          <div className="users-layout">
            <UserList
              users={filteredUsers}
              selectedId={selectedId}
              onSelectUser={handleSelectUser}
            />

            {selectedUser && (
              <aside className="user-details" aria-label="Détails utilisateur">
                <h3>Détails de l'utilisateur</h3>
                <p>Nom : {selectedUser.name}</p>
                <p>Email : {selectedUser.email}</p>
                <p>Rôle : {selectedUser.role}</p>
                <p>Statut : {selectedUser.status}</p>
                  
                  {selectedUser.role === "learner" && !isFormOpen && (
  <button type="button" onClick={handleEditUser}>
    Modifier
  </button>
)} 


                <button type="button" onClick={handleCloseDetails}>
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

export default UserManagement;