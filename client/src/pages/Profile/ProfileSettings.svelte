<script>
  import { onMount } from "svelte";
  import PersonProfile from "../../components/PersonProfile.svelte";
  import DogProfile from "../../components/DogProfile.svelte";

  let activeProfile = "personal";

  const selectProfile = (profile) => {
    activeProfile = profile;
  };

  onMount(() => {
    document.title = "Settings | Pawgress";
  });
</script>

<div class="dashboard-container">
  <h2>Settings</h2>
  <button
    class:active={activeProfile === "personal"}
    on:click={() => selectProfile("personal")}>Personal Profile</button
  >
  <button
    class:active={activeProfile === "dog"}
    on:click={() => selectProfile("dog")}>Dog profile</button
  >
  <hr />
  {#if activeProfile === "personal"}
    <PersonProfile />
  {:else if activeProfile === "dog"}
    <DogProfile />
  {/if}
</div>

<style>
  button {
    border: none;
    background: none;
    margin: 0;
    padding: 10px;
    font-size: 1rem;
    font-weight: 500;
    color: #0a3960;
    border-radius: 7px 7px 0 0;
  }

  .active {
    color: white;
    background: #0a3960;
  }

  h2 {
    margin: 0;
    margin-bottom: 60px;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }

  hr {
    margin: 0 0 60px 0;
    border-top: 1px solid #0a3960;
    color: #0a3960;
  }
</style>
