import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProtectedView from "./components/ProtectedView";
import AdminLayout from "./layouts/AdminLayout";
import LearnerLayout from "./layouts/LearnerLayout";
import AppShell from "./components/AppShell";
function App() {
  const [session, setSession] = useState(null);
  const [currentView , setCurrentView] = useState("home");
  const [sessionMessage, setSessionMessage] = useState("");
  function handleLogin(newSession) {
    setSessionMessage("");
    setCurrentView("home");
    setSession(newSession);
  }

  function handleLogout() {
    setSession(null);
    setCurrentView("home");
    setSessionMessage("");
  }


  function handleSessionExpired() {
  setSession(null);
  setCurrentView("home");
  setSessionMessage("Votre session a expiré. Veuillez vous reconnecter.");
}


  function handleNavigate(view) { // hna app kaybedel 9ima dyal currentView ( mli katwesel "users" , view katkon "users" alrs setCurrentView(view) katekhli currentView teweli "users" )
  setCurrentView(view);  // had function katsete9bel "users" w katebedel state // fhadi bedebet valeur dyalo hya "users" et code hewa view b7al 9ima dyalo setCurrentView("users") et code setCurrentView(view)
  // react :  kay3awed yee7eseb wajiha bel9ima jdida currentView wlat "users" 
  // f app valeur jdida kadoz l adminlayout currentView={currentView} //  7it 9ima li kayna f app wlat "users" had ligne kaydowez nefes 9ima b7al currentView="users"   
  // f admin layout daba props.currentView fiha "users" 
 }

  if (session === null) {
    return (
      <main>
        {sessionMessage !== "" && (
        <p role="alert">{sessionMessage}</p>
        )}
        
        <LoginForm onLogin={handleLogin} />
      </main>
    );
  }

  const role = session.user.role ;

  return (
    <AppShell user={session.user} onLogout={handleLogout}>

      {role === "admin" && (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <AdminLayout  //hna app kayedewez valeur l adminLayout
          currentView={currentView}  // ye3ref class li khes afficher  // app kaye3ti valeur dyal currentView l admin layout  // {currentView}  9ima li kayna f app par example "users" // currentView smya prop li ghadi ye9raha adminLayout b props.currentView // y3ni app 3endo "users" w kay3tiha l adminLayout te7et smya currentView
          onNavigate={handleNavigate} // props.onNavigate //yeteleb men app changer class   // 3ti l adminLayout function handleNavigate te7et smya onNavigate 
          token={session.token}
          onSessionExpired={handleSessionExpired}
          />
          </ProtectedView>
      )}

      {role === "learner" && (
        <ProtectedView session={session} allowedRoles={["learner"]}>
          <LearnerLayout
          token={session.token}
          onSessionExpired={handleSessionExpired}
          />
        </ProtectedView>
      )}

      {role !== "admin" && role !== "learner" && (
        <p role="alert">
          Aucun espace prévu pour votre role dans cette version
        </p>
      )}

  
    </AppShell> 
    
  );
}




export default App;