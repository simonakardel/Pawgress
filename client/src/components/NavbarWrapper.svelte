<script>
  import { useLocation } from "svelte-navigator";
  import SideNav from "./SideNav.svelte";

  const location = useLocation();

  let showNavbar;
  $: showNavbar = !(
    $location.pathname === "/" ||
    $location.pathname === "/login" ||
    $location.pathname === "/signup"
  );
</script>

{#if showNavbar}
  <SideNav />
{/if}
