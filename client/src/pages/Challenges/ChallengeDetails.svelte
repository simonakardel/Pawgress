<script>
  import { onMount, onDestroy } from "svelte";
  import { useParams } from "svelte-navigator";
  import { challengeStore } from "../../stores/challengeStore.js";
  import authStore from "../../stores/authStore.js";

  let params = useParams();
  let id = $params.id;

  let challenges = [];
  let challenge;
  let unsubscribe;

  onMount(() => {
    document.title = "Challenge | Pawgres";
    unsubscribe = challengeStore.subscribe((value) => {
      challenges = value;
    });
  });

  $: {
    challenge = challenges.find((challenge) => challenge._id === id);
  }

  function handleJoinChallengeButton() {
    authStore.joinChallenge(challenge._id);
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>

{#if challenge}
  <div class="dashboard-container">
    <div class="flex-row heading">
      <h2>{challenge.name}</h2>
      <div>
        <button
          on:click|preventDefault={handleJoinChallengeButton}
          class="button join-challenge-btn"
          ><i class="fa-solid fa-plus" />Join</button
        >
      </div>
    </div>

    <div>
      <div class="author">
        <p>Created by: {challenge.createdBy}</p>
      </div>
    </div>

    <p class="description">{challenge.description}</p>
    <div>
      {#each challenge.tasks as task}
        <div class="flex-row tasks">
          <h4>Day {task.dayNumber}</h4>
          <p>{task.name}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .join-challenge-btn {
    background: #3688a6;
    color: white;
    height: 35px;
  }

  .author {
    font-size: 11px;
    color: #112f45;
    background: #dae0e4;
    display: inline-block;
    padding: 5px 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 5px;
  }

  .author p {
    margin: 0;
  }

  .description {
    color: #51697b;
    padding: 30px 0;
  }

  h2 {
    font-size: 28px;
  }

  .flex-row.tasks {
    gap: 20px;
  }

  .flex-row.heading {
    justify-content: space-between;
  }

  i {
    margin-right: 10px;
  }
</style>
