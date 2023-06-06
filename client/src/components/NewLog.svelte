<script>
  import { onMount } from "svelte";
  import goalStore from "../stores/goalStore.js";
  import LogsAPI from "../api/trainingLogs.js";
  import { logsStore } from "../stores/logStore.js";
  import toastr from "toastr";

  export let className;

  let behaviours = [];
  let trainedGoals = [{ rating: 0, goal: null, name: "" }];
  let currentGoals = $goalStore.currentGoals;
  let date;
  let notes;

  const unsubscribe = goalStore.subscribe((goalState) => {
    currentGoals = goalState.currentGoals;
  });

  function setRating(index, r) {
    trainedGoals[index] = { ...trainedGoals[index], rating: r };
  }

  function setRatingBehaviour(index, r) {
    behaviours[index] = { ...behaviours[index], rating: r };
  }

  function addTrainedGoal() {
    trainedGoals = [...trainedGoals, { rating: 0, goal: null, name: ""}];
  }

  function addInputText() {
    behaviours = [...behaviours, { rating: 0, name: "" }];
  }

  async function handleCreateTrainingLog() {

    const newLog = {
      notes: notes,
      date: date,
      goals: trainedGoals.map((trainedGoal) => ({
        _id: trainedGoal.goal ? trainedGoal.goal._id : null,
        rating: trainedGoal.rating,
        name: trainedGoal.goal,
      })),
      behaviours: behaviours.map((behavior) => ({ name: behavior.name, rating: behavior.rating })),
    };

    try {
      const response = await LogsAPI.createTrainingLog(newLog);
      if (response.status === 200) {
        const newLog = { ...response.data, date: new Date(response.data.date) };
        logsStore.update((logs) => [...logs, newLog]);

        date = "";
        notes = "";
        behaviours = [{ rating: 0, name: "" }];
        trainedGoals = [{ rating: 0, goal: null, name: "" }];

        toastr.success("New training log created!");
      } else {
        toastr.error("There was an error, please try again.");
      }
    } catch (error) {
      toastr.error("There was an error, please try again.");
    }
  }

  function getAvailableGoals(trainedGoal) {
    return currentGoals.filter(
      (goal) =>
        !trainedGoals.some((t) => t !== trainedGoal && t.goal === goal.name)
    );
  }

  onMount(() => {
    return () => {
        unsubscribe();
    };
});

</script>

<form class="new-log-container {className}">
  <h3>Log training session</h3>

  <div class={className === "small" ? "flex-column" : "flex-row main"}>
    <div>
      <div class="flex-column">
        <label for="date">Date</label>
        <input
          type="date"
          name="date"
          bind:value={date}
        />
      </div>
      <div class="flex-column">
        <label for="behaviour">What have you trained?</label>
        {#each trainedGoals as trainedGoal, index}
          <div class="flex-row trained-goal">
            <select bind:value={trainedGoal.goal}>
              <option value={null}>Select Goal</option>
              {#each getAvailableGoals(trainedGoal) as goal (goal._id)}
                <option value={goal.name}>{goal.name}</option>
              {/each}
            </select>

            <div class="paw-icons flex-row">
              {#each [1, 2, 3, 4, 5] as i}
                <i
                  class={`fa-solid fa-paw ${
                    trainedGoal.rating >= i ? "active" : ""
                  }`}
                  on:click={() => setRating(index, i)}
                  on:keydown
                />
              {/each}
            </div>
          </div>
        {/each}
        {#if behaviours.length > 0}
          {#each behaviours as behaviour, index}
            <div class="flex-row trained-goal">
              <input
                type="text"
                bind:value={behaviour.name}
                class="behaviour-input"
              />
              <div class="paw-icons flex-row">
                {#each [1, 2, 3, 4, 5] as i}
                  <i
                    class={`fa-solid fa-paw ${
                      behaviour.rating >= i ? "active" : ""
                    }`}
                    on:click={() => setRatingBehaviour(index, i)}
                    on:keydown={() => setRatingBehaviour(index, i)}
                  />
                {/each}
              </div>
            </div>
          {/each}
        {/if}
        <div class="flex-row">
          <button
            on:click|preventDefault={addTrainedGoal}
            class="add-goal-btn dark"
            ><i class="fa-solid fa-plus" />Add Goal</button
          >
          <button
            on:click|preventDefault={addInputText}
            class="add-goal-btn light"
            ><i class="fa-solid fa-plus" />Add Other</button
          >
        </div>
      </div>
    </div>

    <div class="flex-column">
      <label for="notes">Notes</label>
      <textarea
        name="notes"
        rows={className === "small" ? 3 : 10}
        cols="40"
        bind:value={notes}
      />
    </div>
  </div>

  <div class="flex-row create-btn-div">
    <button
      class="create-btn button"
      on:click|preventDefault={handleCreateTrainingLog}>Create</button
    >
  </div>
</form>

<style>
  .new-log-container {
    padding: 30px;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1);
    background: #dae0e4;
    color: #224762;
    border-radius: 20px;
  }
  .new-log-container.large {
    width: 800px;
    margin-bottom: 60px;
  }

  .new-log-container.small {
    width: 400px;
  }

  i {
    color: gray;
    cursor: pointer;
    font-size: 1.5rem;
  }

  i.active {
    color: #ec8b33;
  }

  input[type="date"],
  select {
    height: 48px;
    width: 200px;
  }

  select,
  .behaviour-input {
    width: 200px;
  }

  .trained-goal {
    gap: 20px;
  }

  .paw-icons {
    gap: 7px;
  }

  h3 {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 20px 0;
  }

  label {
    margin: 12px 0 6px 0;
  }

  .add-goal-btn {
    padding: 10px;
    border-radius: 20px;
    background: #ffffff;
    cursor: pointer;
    font-weight: 600;
    width: 120px;
  }

  .add-goal-btn.dark {
    border: 1px solid #0a3960;
    color: #0a3960;
  }

  .add-goal-btn.light {
    border: 1px solid #ec8b33;
    color: #ec8b33;
  }

  .add-goal-btn.dark i {
    font-size: 1rem;
    color: #0a3960;
    padding-right: 6px;
  }

  .add-goal-btn.light i {
    font-size: 1rem;
    color: #ec8b33;
    padding-right: 6px;
  }

  .create-btn-div {
    justify-content: flex-end;
  }

  .button {
    height: 48px;
    color: white;
    background: #0a3960;
  }

  .button:hover {
    background: #224762;
  }

  .flex-row.main {
    justify-content: space-between;
    align-items: flex-start;
  }
</style>
