<script>
  import toastr from "toastr";
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

  // UPDATING GOAL ON THE SERVER WHEN CHECKBOXES CHANGE
  async function handleSubgoalChange(subgoal) {

  let updatedSubgoal = { ...subgoal, achieved: subgoal.achieved };

  let updatedSubgoals = goal.subgoals.map((sg) =>
    sg._id === subgoal._id ? updatedSubgoal : sg
  );

  let allSubgoalsAchieved = updatedSubgoals.every((sg) => sg.achieved);

  let updatedGoal = { ...goal, subgoals: updatedSubgoals, achieved: allSubgoalsAchieved };

  try {
    await GoalAPI.updateGoal(goal._id, updatedGoal);
    updateGoalStatusInStore(updatedGoal);
  } catch (error) {
    toastr.error("Error updating goal.");
  }
}


  // UPDATING GOAL IN GOAL STORE
  function updateGoalStatusInStore(updatedGoal) {
  let allSubgoalsAchieved = updatedGoal.subgoals.every(
    (subgoal) => subgoal.achieved
  );

  goalStore.update((store) => {
    let newCurrentGoals = [...store.currentGoals];
    let newAchievedGoals = [...store.achievedGoals];
    if (allSubgoalsAchieved) {
      newCurrentGoals = newCurrentGoals.filter((g) => g._id !== updatedGoal._id);
      newAchievedGoals.push(updatedGoal);
    } else {
      newAchievedGoals = newAchievedGoals.filter((g) => g._id !== updatedGoal._id);
      if (!newCurrentGoals.find(g => g._id === updatedGoal._id)) {
        newCurrentGoals.push(updatedGoal);
      }
    }

    return {
      currentGoals: newCurrentGoals,
      achievedGoals: newAchievedGoals,
    };
  });
}


// DELETING GOAL
  async function handleDeleteButtonClick() {
  try {
    const response = await GoalAPI.deleteGoal(goal._id);

    if (response.status === 200){
      toastr.success("Successfully deleted goal.");
       goalStore.update((store) => {

      let newCurrentGoals = store.currentGoals.filter((g) => g._id !== goal._id);
      let newAchievedGoals = store.achievedGoals.filter((g) => g._id !== goal._id);

      return {
        currentGoals: newCurrentGoals,
        achievedGoals: newAchievedGoals
      };
    });
    }
  } catch (error) {
    toastr.error("Error deleting goal.")
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
      {#each goal.subgoals as subgoal}
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
          on:keydown={handleDeleteButtonClick}
        />
      </div>
    {/if}
  </div>
{/if}




<style>
  .goal-container {
    width: 240px;
    min-height: 150px;
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
