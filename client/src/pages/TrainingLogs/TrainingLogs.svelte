<script>
  import TrainingLog from "../../components/TrainingLog.svelte";
  import NewLog from "../../components/NewLog.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.title = "Training Logs || Pawgress";
  });


  
</script>

<div class="dashboard-container">
  <NewLog className="large"/>


  <h2>Training Logs</h2>

  <TrainingLog />


</div>

