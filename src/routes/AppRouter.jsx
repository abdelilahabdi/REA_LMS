import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import AdminLayout from "../layouts/AdminLayout";
import LearnerLayout from "../layouts/LearnerLayout";
import LoginPage from "../pages/LoginPage";
import UserManagement from "../components/UserManagement";
import CourseManagement from "../components/CourseManagement";
import useAuth from "../hooks/useAuth";
import CatalogPage from "../pages/CatalogPage";
import CourseDetailPage from "../pages/CourseDetailPage";
function HomePage() {
  const { isAuthenticated } = useAuth();

  let linkText = "Se connecter";

  if (isAuthenticated) {
    linkText = "Accéder à mon espace";
  }

  return (
    <main>
      <h1>EduLearn</h1>
      <p>Bienvenue sur notre plateforme de formation.</p>
      <p>
        <Link to="/courses">Explorer le catalogue</Link>
      </p>
      <Link to="/login">{linkText}</Link>
    </main>
  );
}

function UsersPage() {
  const { token, expireSession } = useAuth();

  return (
    <UserManagement
      token={token}
      onSessionExpired={expireSession}
    />
  );
}

function AdminCoursesPage() {
  const { token, expireSession } = useAuth();

  return (
    <CourseManagement
      token={token}
      onSessionExpired={expireSession}
    />
  );
}

function LearnerDashboardPage() {
  const { token, expireSession } = useAuth();

  return (
    <LearnerLayout
      token={token}
      onSessionExpired={expireSession}
    />
  );
}

function UnauthorizedPage() {
  return (
    <main>
      <h1>403 — Accès refusé</h1>
      <p>Votre rôle ne permet pas d'accéder à cette page.</p>
      <Link to="/">Retour à l'accueil</Link>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main>
      <h1>404 — Page introuvable</h1>
      <Link to="/">Retour à l'accueil</Link>
    </main>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/courses" element={<CatalogPage />} />

      <Route
        path="/courses/:courseId"
        element={<CourseDetailPage />}
       />


      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={<p>Choisissez une rubrique dans le menu.</p>}
              />

              <Route path="users" element={<UsersPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["learner"]} />}>
            <Route
              path="/dashboard"
              element={<LearnerDashboardPage />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
            <Route
              path="/trainer/courses"
              element={
                <section>
                  <h2>Espace Formateur</h2>
                  <p>La gestion de vos cours sera ajoutée prochainement.</p>
                </section>
              }
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;