<script>
  import { Link } from "svelte-navigator";
  import LogoutBtn from "./LogoutBtn.svelte";
  import ProfileAvatar from "./ProfileAvatar.svelte";
  import Logo from "./Logo.svelte";
</script>

<nav class="flex-column">
  <div class="top flex-column">
    <div class="logo-div">
      <Logo  color="white"/>
    </div>

    <Link
      to="/dashboard"
      class="flex-row menu"
    >
      <div class="icon">
        <i class="fa-solid fa-house" />
      </div>
      Dashboard
    </Link>
    <Link
      to="/training-logs"
      class="flex-row menu"
    >
      <div class="icon">
        <i class="fa-solid fa-note-sticky" />
      </div>
      Training Logs
    </Link>
    <Link
      to="/goals"
      class="flex-row menu"
    >
      <div class="icon">
        <i class="fa-sharp fa-solid fa-bullseye" />
      </div>
      Goals
    </Link>
    <Link
      to="/challenges"
      class="flex-row menu"
    >
      <div class="icon">
        <i class="fa-solid fa-puzzle-piece" />
      </div>
      Challenges
    </Link>
    <Link
      to="/calculator"
      class="flex-row menu"
    >
      <div class="icon">
        <i class="fa-solid fa-calculator" />
      </div>
      BARF Calculator
    </Link>
  </div>

  <div class="bottom flex-column">
    <Link
      to="/contact"
      class="flex-row menu"
    >
      <div class="small-icon">
        <i class="fa-solid fa-envelope" />
      </div>
      Support
    </Link>
    <Link
      to="/profile"
      class="flex-row menu"
    >
      <div class="small-icon">
        <i class="fa-solid fa-gear" />
      </div>
      Profile Settings
    </Link>
    <div class="flex-row profile">
      <ProfileAvatar />
      <LogoutBtn />
    </div>
  </div>
</nav>

<style>
  nav {
    position: absolute;
    left: 0;
    top: 0;
    padding: 1.5rem;
    width: 300px;
    position: fixed;
    height: 95%;
    background: #224762;
    color: inherit;
    border-right: 0.5px solid lightgray;
    justify-content: space-between;
    overflow: auto;
    color: white;
  }

  .logo-div {
    margin-bottom: 20px;
  }

  .icon {
    background: #f0f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    width: 35px;
    height: 35px;
    margin-right: 15px;
    font-size: 1.25rem;
    color: #0a3960;
  }

  .profile {
    border-top: 0.5px solid lightgray;
    padding: 15px 0;
    justify-content: space-between;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
  }

  .small-icon {
    background: none;
    margin-right: 15px;
    padding: 5px;
  }
</style>
