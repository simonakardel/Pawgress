<script>
  import ButtonLink from "../../components/ButtonLink.svelte";
  import Logo from "../../components/Logo.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.title = "Pawgress";
  });

</script>

<div class="frontpage">
  <div class="flex-row nav">
    <Logo color=""/>

    <div class="flex-row">
      <ButtonLink
        path="/login"
        text="Login"
        className="grey-btn"
      />
      <ButtonLink
        path="/signup"
        text="Sign up"
        className="dark-btn"
      />
    </div>
  </div>

  <div class="flex-column heading">
    <h1>Pawgress🐾 your way to a <span>well-behaved</span> pup 🦮!</h1>
    <ButtonLink
      path="/signup"
      text="Get Started"
      className="get-started-btn orange-btn lg"
    />
  </div>

  <div class="illustration">
    <img
      src="main_page.svg"
      alt="dog-walking-illustration"
    />
  </div>
</div>

<style>

  .nav {
    justify-content: space-between;
    align-items: flex-end;
  }

  .heading {
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 70vw;
    margin: 5vh auto;
  }

  h1 {
    font-weight: 800;
    line-height: 135%;
    font-size: 4rem;
    margin: 20px 0;
  }

  .illustration {
    width: 450px;
    margin: -60px auto 0 auto;
  }

  .illustration img {
    width: 100%;
  }
</style>
