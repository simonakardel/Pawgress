<script>
  export let achievedGoals;
  import Goal from "./Goal.svelte";
</script>

<section>
  <h2>Completed Goals</h2>
  <div class="flex-row goals">
    {#each achievedGoals as goal, index (goal._id)}
      {#if index === 4}
        <div>
          <img
            src="/goals2.svg"
            alt="dog-illustration"
            class="img-div"
          />
        </div>
      {/if}

      <Goal
        {goal}
        className="achieved large"
        achievedGoalClass="orange"
      />
    {/each}
  </div>
</section>

<style>

  h2 {
    max-width: 500px;
  }

  section {
    margin-top: 90px;
  }

  .goals {
    padding-top: 30px;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 60px;
  }

  .img-div {
    width: 280px;
  }

  img {
    max-height: 250px;
  }
</style>
