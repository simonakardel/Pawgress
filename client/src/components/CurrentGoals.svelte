<script>
  import Goal from "./Goal.svelte";
  export let currentGoals;
</script>


  <h2>Current goals</h2>
  <div class="goals">
    {#each currentGoals as goal, index (goal._id)}
      {#if index === 0}
        <div class="img-div">
          <img
            src="/goals.svg"
            alt="dog-illustration"
          />
        </div>
      {/if}
      <Goal
        {goal}
        className="current large"
        achievedGoalClass=""
      />
    {/each}
  </div>


<style>
  .goals {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 30px;
    padding-top: 30px;
  }

  h2 {
    max-width: 200px;
  }


  .img-div {
    width: 100%;
  }
  img {
    max-height: 200px;
  }
</style>
