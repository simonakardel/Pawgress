<script>
  import { Router, Link, Route, useLocation } from "svelte-navigator";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";
  import Frontpage from "./pages/Frontpage/Frontpage.svelte";
  import ProtectedRoute from "./components/ProtectedRoute.svelte";
  import Dashboard from "./pages/Dashboard/Dashboard.svelte";
  import Challenges from "./pages/Challenges/Challenges.svelte";
  import Goals from "./pages/Goals/Goals.svelte";
  import Calculator from "./pages/Calculator/Calculator.svelte";
  import TrainingLogs from "./pages/TrainingLogs/TrainingLogs.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
  import NavbarWrapper from "./components/NavbarWrapper.svelte";
  import ProfileSettings from "./pages/Profile/ProfileSettings.svelte";
  import NewChallenge from "./pages/Challenges/NewChallenge.svelte";
  import AllChallenges from "./pages/Challenges/AllChallenges.svelte";
  import PublicChallenge from "./components/PublicChallenge.svelte";
  import ChallengeDetails from "./pages/Challenges/ChallengeDetails.svelte";



</script>



<Router primary={false}>


<NavbarWrapper/> 

  <main>


    <Route path="/" >
      <Frontpage/>
    </Route>
    <Route path="/signup" >
      <Signup  />
    </Route>
    <Route path="/login" >
      <Login />
    </Route>

    <Route path="/dashboard" >
       <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
    </Route>

    <Route path="/challenges" >
      <ProtectedRoute>
        <Challenges />
      </ProtectedRoute>
    </Route>

    <Route path="/goals" >
      <ProtectedRoute>
        <Goals/>
      </ProtectedRoute>
    </Route>

    <Route path="/calculator">
      <ProtectedRoute>
        <Calculator/>
      </ProtectedRoute>
    </Route>

    <Route path="/training-logs">
      <ProtectedRoute>
        <TrainingLogs/>
      </ProtectedRoute>
    </Route>

    <Route path="/contact">
      <ProtectedRoute>
        <Contact/>
      </ProtectedRoute>
    </Route>

    <Route path="/profile">
      <ProtectedRoute>
        <ProfileSettings/>
      </ProtectedRoute>
    </Route>

    <Route path="/new-challenge">
      <ProtectedRoute>
        <NewChallenge/>
      </ProtectedRoute>
    </Route>

    <Route path="/all-challenges">
      <ProtectedRoute>
   <AllChallenges/>
      </ProtectedRoute>
    </Route>

    <Route path="/challenge/:id">
      <ProtectedRoute>
<ChallengeDetails/>
      </ProtectedRoute>
    </Route>



  </main>
</Router>
