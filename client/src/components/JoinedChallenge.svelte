<script>
  import { restrictParagraphLength } from "../utils/helperFunctions.js";
  export let challenge;
  export let onTaskCompletion;

  let isChallengeVisible = false;
  let completedTasksCount = 0;
  let allTasksCompleted = false;

  function handleCheckboxChange(task, index) {
    onTaskCompletion(challenge._id, task._id);
  }

  const toggleChallenge = () => {
    isChallengeVisible = !isChallengeVisible;
  };

  $: completedTasksCount = challenge.tasks.filter(task => task.completed).length;
  $: allTasksCompleted = completedTasksCount === challenge.tasks.length;
</script>

<div class="challenge-container">
  <div class="flex-row heading">
    <div>
      <h4>{challenge.name}</h4>
      <div class="author">
        <p>
          <i class="fa-solid fa-user" />{challenge.createdBy.firstName}
          {challenge.createdBy.lastName}
        </p>
      </div>
    </div>

    <div class="finished-tasks">
      <p>
       
        {#if allTasksCompleted} 
          <span><i class="fa-solid fa-check"></i>Finished</span>
          {:else}
          {completedTasksCount}/{challenge.tasks.length} 
        {/if}
      </p>
    </div>
  </div>

  <div class="flex-row description">
    <div>
      <p>{restrictParagraphLength(challenge.description)}</p>
    </div>

    <div
      on:click={toggleChallenge}
      on:keydown={toggleChallenge}
    >
      <i
        class={isChallengeVisible
          ? "fa-solid fa-angle-down rotated"
          : "fa-solid fa-angle-down"}
      />
    </div>
  </div>

  {#if isChallengeVisible}
    <div class="expanding-part">
      {#each challenge.tasks as task, index}
        <div class="flex-row tasks">
          <input
            type="checkbox"
            bind:checked={task.completed}
            on:change={() => handleCheckboxChange(task, index)}
          />

          <h4>Day {task.dayNumber}</h4>
          <p>{task.name}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .challenge-container {
    width: 400px;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
    background: #fcfcfd;
    color: #224762;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .fa-angle-down {
    transition: transform 0.3s ease;
  }

  .rotated {
    transform: rotate(180deg);
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

  i {
    margin-right: 10px;
  }

  .flex-row.description {
    justify-content: space-between;
    align-items: flex-end;
  }

  .flex-row.heading {
    justify-content: space-between;
  }

  .flex-row.tasks {
    align-items: center;
    gap: 20px;
  }

  input {
    margin: 0;
  }


  .finished-tasks {
    background: #224762;
    color: white;
    font-weight: 500;
    padding: 0 15px;
    border-radius: 25px;
  }

  input[type="checkbox"] {
    box-shadow: none;
  }
</style>
