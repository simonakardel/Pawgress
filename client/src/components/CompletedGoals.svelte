<script>
  export let achievedGoals;
  import Goal from "./Goal.svelte";
</script>

<section>
  <h2>Completed Goals</h2>
  <div class="goals">
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
  .goals {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 30px;
  }

  h2 {
    max-width: 500px;
  }

  section {
    margin-top: 90px;
  }

  .img-div {
    width: 100%;
  }
  img {
    max-height: 200px;
  }
</style>
