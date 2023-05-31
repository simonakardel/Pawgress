<script>
  import { challengeStore } from "../../stores/challengeStore.js";
  import PublicChallenge from "../../components/PublicChallenge.svelte";
</script>

<div class="dashboard-container">
  <h2>Join challenges</h2>
  <div class="grid-public-challenges">
    {#each $challengeStore as challenge (challenge._id)}
      <PublicChallenge {challenge} />
    {/each}
  </div>
</div>

<style>
  .grid-public-challenges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
  }
</style>
