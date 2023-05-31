<script>
  import GoalAPI from "../api/goals.js";
  import goalStore from "../stores/goalStore.js";

  export let goal;
  export let className;
  export let achievedGoalClass;

  let isSubgoalsVisible = false;
  let totalTasks = 0;
  let finishedTasks = 0;

  $: {
    totalTasks = goal.subgoals.length;
    finishedTasks = goal.subgoals.filter((subgoal) => subgoal.achieved).length;
  }

  const toggleSubgoals = () => {
    isSubgoalsVisible = !isSubgoalsVisible;
  };

  async function handleSubgoalChange(subgoal, index) {
    let updatedSubgoal = { ...subgoal, achieved: !subgoal.achieved };

    let updatedSubgoals = goal.subgoals.map((sg, i) =>
      i === index ? updatedSubgoal : sg
    );

    let updatedGoal = { ...goal, subgoals: updatedSubgoals };

    let allSubgoalsAchieved = updatedSubgoals.every((sg) => sg.achieved);

    updatedGoal.achieved = allSubgoalsAchieved;

    try {
      await GoalAPI.updateGoal(goal._id, updatedGoal);

      goal = updatedGoal;
      updateGoalStatusInStore();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  function updateGoalStatusInStore() {
    let allSubgoalsAchieved = goal.subgoals.every(
      (subgoal) => subgoal.achieved
    );

    goalStore.update((store) => {
      let newStore = JSON.parse(JSON.stringify(store));

      if (allSubgoalsAchieved) {
        newStore.currentGoals = newStore.currentGoals.filter(
          (g) => g._id !== goal._id
        );
        newStore.achievedGoals.push(JSON.parse(JSON.stringify(goal)));
      } else {
        newStore.achievedGoals = newStore.achievedGoals.filter(
          (g) => g._id !== goal._id
        );
        newStore.currentGoals.push(JSON.parse(JSON.stringify(goal)));
      }

      return newStore;
    });
  }

  async function handleDeleteButtonClick() {
    try {
      console.log(goal);
      await GoalAPI.deleteGoal(goal._id);
      goalStore.update((store) => {
        let newStore = JSON.parse(JSON.stringify(store));

        newStore.currentGoals = newStore.currentGoals.filter(
          (g) => g._id !== goal._id
        );
        newStore.achievedGoals = newStore.achievedGoals.filter(
          (g) => g._id !== goal._id
        );

        return newStore;
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }
</script>

{#if className === "small"}
  <div class="{className} flex-row">
    <h5>{goal.name}</h5>
    <p class="finished-tasks {achievedGoalClass}">
      {finishedTasks}/{totalTasks}
    </p>
  </div>
{:else}
  <div class="goal-container {className}">
    <h4>{goal.name}</h4>

    <p class="description">{goal.description}</p>

    <div class="flex-row space-between">
      <p class="finished-tasks {achievedGoalClass}">
        {finishedTasks}/{totalTasks}
      </p>

      <div
        on:click={toggleSubgoals}
        on:keydown={toggleSubgoals}
      >
        <i
          class={isSubgoalsVisible
            ? "fa-solid fa-angle-down rotated"
            : "fa-solid fa-angle-down"}
        />
      </div>
    </div>

    {#if isSubgoalsVisible}
      {#each goal.subgoals as subgoal, index (index)}
        <div class="flex-row subgoal">
          <input
            type="checkbox"
            bind:checked={subgoal.achieved}
            on:change={() => handleSubgoalChange(subgoal)}
          />

          <h5 class="subgoal">{subgoal.name}</h5>
        </div>
      {/each}
      <div class="flex-row icon">
        <i
          class="fa-solid fa-trash"
          on:click={handleDeleteButtonClick}
          on:keydown
        />
      </div>
    {/if}
  </div>
{/if}

<style>
  .goal-container {
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
    background: #fcfcfd;
    color: #224762;
  }
  .flex-row.heading {
    justify-content: space-between;
  }

  .fa-trash {
    color: #96a5b0;
  }
  input {
    box-shadow: none;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  h5 {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: 400;
  }

  .description {
    font-size: 1rem;
    margin: 10px 0;
  }

  .heading {
    display: flex;
    justify-content: space-between;
  }

  i {
    cursor: pointer;
  }

  .fa-angle-down {
    transition: transform 0.3s ease;
  }

  .rotated {
    transform: rotate(180deg);
  }

  .info {
    justify-content: space-between;
  }

  .finished-tasks {
    background: #0a3960;
    color: white;
    padding: 12px;
    border-radius: 20px;
    font-weight: 500;
  }

  .orange {
    background: #eea35e;
  }

  .flex-row.space-between {
    justify-content: space-between;
  }

  .flex-row.subgoal {
    padding-bottom: 20px;

    gap: 10px;
  }

  .flex-row.icon {
    justify-content: flex-end;
  }

  .small.flex-row {
    justify-content: space-between;
    min-width: 150px;
  }

  h5 {
    font-size: 1.1rem;
  }
</style>
