<script>
  import Goal from "./Goal.svelte";
  export let currentGoals;
</script>


  <h2>Current goals</h2>
  <div class="flex-row goals">
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
    padding-top: 30px;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 60px;
  }

  h2 {
    max-width: 200px;
  }


  .img-div {
    width: 280px;
  }

  img {
    max-height: 250px;
  }
</style>
