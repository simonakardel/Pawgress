<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-navigator";
  import authStore from "../stores/authStore.js";
  export let color;

  let isAuthenticated = false;
  let logoLink = "/";

  const unsubscribe = authStore.subscribe(({ isAuthenticated: value }) => {
    isAuthenticated = value;
    logoLink = isAuthenticated ? "/dashboard" : "/";
  });

  onMount(() => {
    return () => {
      unsubscribe();
    };
  });
</script>

<div class="logo">
  <Link to={logoLink}>
    {#if color == "white"}
    <img
      src="white-logo.svg"
      alt="pawgress-logo"
    />
    {:else}
    <img
      src="logo3.svg"
      alt="pawgress-logo"
    />

    {/if}
  </Link>
</div>

<style>
  .logo {
    width: 160px;
  }

  .logo img {
    width: 100%;
  }
</style>
