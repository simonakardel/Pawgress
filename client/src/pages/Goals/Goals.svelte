<script>
  import { onMount } from "svelte";
  import GoalAPI from "../../api/goals.js";
  import goalStore from "../../stores/goalStore.js";
  import CurrentGoals from "../../components/CurrentGoals.svelte";
  import CompletedGoals from "../../components/CompletedGoals.svelte";
  import toastr from "toastr";

  let newGoalSelected = false;

  let steps = [""];
  let goalName;
  let goalDescription;

  function addStep(e) {
    e.preventDefault();
    steps = [...steps, ""];
  }

  function deleteStep(index) {
    steps.splice(index, 1);
    steps = [...steps];
  }

  function handleStepChange(index, event) {
    steps[index] = event.target.value;
    steps = [...steps];
  }

  onMount(async () => {
    document.title = "Goals | Pawgress";
    try {
      const currentGoalsResponse = await GoalAPI.getCurrentGoals();
      const achievedGoalsResponse = await GoalAPI.getAchievedGoals();

      goalStore.set({
        currentGoals: currentGoalsResponse.data.goals,
        achievedGoals: achievedGoalsResponse.data.goals,
      });

  
    } catch (error) {
      console.error("Error fetching current goals:", error);
    }
  });

  async function handleCreateButtonClick(e) {
    e.preventDefault();

    const newGoal = {
      name: goalName,
      description: goalDescription,
      subgoals: steps.map((name) => ({ name, achieved: false })),
    };

    try {
      const response = await GoalAPI.createGoal(newGoal);
      if(response.status === 200){
        toastr.success("New goal added!");
        goalStore.update((value) => {
        return {
          ...value,
          currentGoals: [...value.currentGoals, response.data],
        };
      });


      goalName = "";
      goalDescription = "";
      steps = [""];

      newGoalSelected = false;
      } else {
        toastr.error("There was an error, try again");
      }


    } catch (error) {
      toastr.error("There was an error, try again");
    }
  }
</script>

<div class="dashboard-container">
  <button
    on:click={() => (newGoalSelected = true)}
    class="new-goal-button button"
  >
    <i class="fa-solid fa-plus" /> New Goal</button
  >

  {#if newGoalSelected}
    <form class="new-goal-container">
      <h3>Set a new training goal</h3>

      <i
        class="fa-solid fa-xmark close-btn"
        on:click={() => {
          newGoalSelected = false;
        }}
        on:keydown={() => {
          newGoalSelected = false;
        }}
      />
      <div class="flex-row main">
        <div class="left-column">
          <label for="goal-heading">Heading</label>
          <input
            type="text"
            name="goal-heading"
            bind:value={goalName}
            placeholder="Enter heading"
            class="long-input"
          />
          <div class="flex-column">
            <label for="description">Description</label>
            <textarea
              name="description"
              rows="10"
              bind:value={goalDescription}
            />
          </div>
        </div>

        <div class="right-column">
          <label for="step">Steps to achieve your goal</label>

          {#each steps as step, index}
            <div class="flex-row step">
              <input
                name="step"
                type="text"
                bind:value={steps[index]}
                on:input={(event) => handleStepChange(index, event)}
                placeholder={`Step ${index + 1}`}
                class="long-input"
              />
              <i
                class="fa-solid fa-xmark close-step {index === 0
                  ? 'hidden'
                  : ''}"
                on:click={() => deleteStep(index)}
                on:keydown
              />
            </div>
          {/each}

          <button
            on:click={addStep}
            class="add-step-btn"><i class="fa-solid fa-plus" /> Add step</button
          >
        </div>
      </div>
      <div class="create-btn-container">
        <input
          type="submit"
          value="Create"
          on:click={handleCreateButtonClick}
          class="create-btn button"
        />
      </div>
    </form>
  {/if}

  {#if $goalStore.currentGoals}
    <CurrentGoals currentGoals={$goalStore.currentGoals} />
  {/if}

  {#if $goalStore.achievedGoals}
    <CompletedGoals achievedGoals={$goalStore.achievedGoals} />
  {/if}
</div>

<style>
  .hidden {
    visibility: hidden;
  }

  h3 {
    font-weight: 500;
    font-size: 1.5rem;
  }

  .flex-row.main {
    gap: 20px;
  }
  .new-goal-button {
    background: #ec8b33;
    color: white;
    height: 48px;
    margin: 0;
    position: absolute;
    right: 5vw;
    top: 90px;
  }

  .new-goal-button i {
    margin-right: 5px;
  }
  .long-input {
    height: 40px;
    width: 100%;
    margin: 8px 0;
  }

  .left-column,
  .right-column {
    flex: 1;
  }
  textarea {
    width: 100%;
  }

  .new-goal-container {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1);
    margin: 60px 0;
    min-height: 300px;
    flex-wrap: wrap;
    width: 700px;
    background: #dae0e4;
    color: #224762;
  }

  .close-btn {
    position: relative;
    left: 700px;
    bottom: 95px;
    color: #3a5a72;
    cursor: pointer;
  }

  .flex-row {
    justify-content: space-around;
    align-items: flex-start;
  }

  .create-btn-container {
    display: flex;
    justify-content: flex-end;
    margin: 12px 0 0 0;
  }

  .create-btn {
    color: white;
    background: #0a3960;
    height: 48px;
  }

  label {
    margin: 12px 0 6px 0;
  }

  .flex-row .step {
    align-items: center;
    gap: 5px;
  }

  .close-step {
    color: #96a5b0;
    cursor: pointer;
  }

  .add-step-btn {
    padding: 12px;
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid #0a3960;
    cursor: pointer;
    color: #0a3960;
    font-weight: 600;
  }
</style>
