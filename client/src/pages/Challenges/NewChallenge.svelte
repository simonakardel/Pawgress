<script>
  import { navigate } from "svelte-navigator";
  import ChallengeAPI from "../../api/challenges.js";
  import { challengeStore } from "../../stores/challengeStore.js";
  import { onMount } from "svelte";
  import toastr from "toastr";

  let days;
  let errorMessage = "";
  let tasks = [];
  let challengeName;
  let challengeDescription;
  $: {
    if (days === undefined) {
      errorMessage = "";
    } else if (days >= 1 && days <= 15) {
      errorMessage = "";
      tasks = Array(days)
        .fill()
        .map((_, i) => (tasks && tasks[i] ? tasks[i] : { name: "" }));
    } else if (days > 15) {
      errorMessage = "The number of days cannot be more than 15.";
    } else {
      errorMessage = "The number of days cannot be less than 1.";
    }
  }

  async function handleCreateButton() {
    const newChallenge = {
      name: challengeName,
      description: challengeDescription,
      tasks: tasks.map((task, index) => ({ ...task, dayNumber: index + 1 })),
    };

    try {
      const response = await ChallengeAPI.createChallenge(newChallenge);

      if (response.status === 200) {
        challengeStore.update(challenges => [...challenges, response.data]);

        challengeName = "";
        challengeDescription = "";
        days = 1;
        toastr.success("Challenge submitted!")
        navigate("/challenges");
      } else {
        toastr.error("There was an error, try again.")
      }
    } catch (error) {
      toastr.error("There was an error, try again.")
    }
  }

  onMount(() => {
    document.title = "Submit challenge || Pawgress";
  });
</script>

<div class="dashboard-container">
  <div class="flex-row heading">
    <div>
      <h2>Create Your Own Dog Training Challenge</h2>
      <p>
        Ready to put your furry friend to the test? Create your unique challenge
        here and share it with others. Set the bar high, make it fun, and let's
        inspire others to train their dogs in new and exciting ways!
      </p>
    </div>

    <img
      src="new-challenge.svg"
      alt="dog-illustration"
    />
  </div>

  <form>
    <div class="flex-column">
      <label for="name">Challenge Name</label>
      <input
        type="text"
        name="name"
        bind:value={challengeName}
        placeholder="Enter the name of your challenge"
      />
    </div>

    <div class="flex-column">
      <label for="description">Challenge Description</label>
      <p class="small-p">
        Briefly describe what your challenge is about so other users can
        understand what to do.
      </p>
      <textarea
        name="description"
        class="description"
        bind:value={challengeDescription}
        rows="15"
        placeholder="Describe the challenge..."
      />
    </div>
    <div class="flex-column">
      <label for="days">Challenge Duration (in Days)</label>
      <p class="small-p">
        How long will your challenge last? Choose a duration between 1 to 15
        days.
      </p>
      <input
        type="number"
        name="days"
        class="short-input"
        bind:value={days}
      />
      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}
    </div>

    <div class="tasks">
      {#each tasks as task, index (index)}
        <div class="flex-row task-div">
          <label
            class="day-label"
            for="task">Day {index + 1}</label
          >
          <input
            name="task"
            type="text"
            bind:value={task.name}
            placeholder="What's the task for day {index + 1}?"
            class="long-input"
          />
        </div>
      {/each}
    </div>

    <div class="flex-row btn">
      <input
        type="submit"
        on:click|preventDefault={handleCreateButton}
        on:keydown={handleCreateButton}
        class="button"
        value="Submit Your Challenge"
      />
    </div>
  </form>
</div>

<style>
  .button {
    background: #0a3960;
    color: white;
    height: 48px;
  }

  .button:hover {
    background: #224762;
    color: white;
  }

  .flex-row.btn {
    align-items: flex-end;
    justify-content: flex-end;
  }

  .description {
    font-family: "Poppins", sans-serif;
  }

  label {
    margin-top: 30px;
  }

  .short-input {
    width: 150px;
  }

  .long-input {
    width: 300px;
  }

  .small-p {
    font-size: 14px;
    color: #51697b;
    margin: 5px 0;
  }

  .flex-row.task-div {
    gap: 20px;

    align-items: center;
  }

  .day-label {
    margin: 0;
    padding-top: 12px;
    font-size: 18px;
    width: 80px;
  }

  .tasks {
    margin: 60px 0;
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(300px, 1fr)
    ); /* adjust 300px as per your requirement */
    gap: 20px; /* adjust as per your requirement */
  }

  .flex-row.heading {
    align-items: center;
  }

  img {
    width: 250px;
  }
</style>
