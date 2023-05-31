<script>
  import { onMount, onDestroy } from "svelte";
  import LogsAPI from "../api/trainingLogs.js";
  import { logsStore } from "../stores/logStore.js";
  import toastr from "toastr";
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  }
  
  let logsFilter = "week";
  
  function filterLogs(filter) {
    logsFilter = filter;
  }
  
  let rawLogs = [];
  let unsubscribe;
  
  unsubscribe = logsStore.subscribe((logs) => {
    rawLogs = logs;
  });
  
  $: rawLogs = $logsStore.filter(log => {
  if (logsFilter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return log.date >= weekAgo;
  } else if (logsFilter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return log.date >= monthAgo;
  } else if (logsFilter === 'all') {
    return true;
  }
  return false;
});


  
  onMount(async () => {
    try {
      const response = await LogsAPI.getTrainingLogs();
      console.log("training", response.data)
      logsStore.set(
        response.data
          .map((log) => {
            log.date = new Date(log.date);
            return log;
          })
          .sort((a, b) => b.date - a.date)
      );

    } catch (error) {
     toastr.error("There was an error.")
    }
  });
  
  onDestroy(() => {
    unsubscribe();
  });
  </script>
  

  <div class="flex-row button-div">
    <button
      on:click={() => filterLogs("week")}
      class={`button ${logsFilter === 'week' ? 'active' : ''}`}>Last 7 days</button>
    <button
      on:click={() => filterLogs("month")}
      class={`button ${logsFilter === 'month' ? 'active' : ''}`}>Last 30 days</button>
    <button
      on:click={() => filterLogs("all")}
      class={`button ${logsFilter === 'all' ? 'active' : ''}`}>All logs</button>
  </div>
  

<div class="grid-container">
  {#each rawLogs as log}
    <div class="log-container">
      <div class="flex-row main">
        <div class="log-date">
          <h4>{formatDate(log.date)}</h4>
        </div>

        <div>
          <div>
            {#each log.goals as goal}
              <div class="flex-row goal">
                <p>{goal.name}</p>

                <div>
                  {#each Array(5) as _, i}
                    <i
                      class={`fa-solid fa-paw ${
                        i < goal.rating ? "active-paw" : "inactive-paw"
                      }`}
                    />
                  {/each}
                </div>
              </div>
            {/each}

            {#each log.behaviours as behaviour}
              <div class="flex-row goal">
                <p>{behaviour.name}</p>
                <div>
                  {#each Array(5) as _, i}
                    <i
                      class={`fa-solid fa-paw ${
                        i < behaviour.rating ? "active-paw" : "inactive-paw"
                      }`}
                    />
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="notes-div">
        <p>
          {log.notes}
        </p>
      </div>
    </div>
  {/each}
</div>

<style>
  .button-div {
    margin: 30px 0 60px 0;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }

  .button-div button {
    font-size: 14px;
    font-weight: 500;
    background: #bbd7e1;
    color: #224762;
    margin-right: 15px;
  }

  .button-div button.active {
    background: #EC8B33;
    color: white;
  }

  .log-container {
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1);
    padding: 20px;
    border-radius: 25px;
    background: #fcfcfd;
    color: #224762;
  }

  .flex-row.goal {
    justify-content: space-between;
    gap: 20px;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  .notes-div {
    color: grey;
    font-size: 14px;
  }

  p {
    margin: 8px 0;
  }

  .flex-row.main {
    align-items: flex-start;
    gap: 30px;
  }
  .log-date {
    background: #224762;
    color: white;
    border-radius: 60px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .flex-row i {
    padding: 4px;
  }

  .active-paw {
    color: #ec8b33;
  }

  .inactive-paw {
    color: grey;
  }

</style>
