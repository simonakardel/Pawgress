<script>
  import { onMount } from "svelte";
  import UserApi from "../../api/user.js";
  import NewLog from "../../components/NewLog.svelte";
  import userState from "../../stores/userStore.js";
  import goalStore from "../../stores/goalStore.js";
  import GoalAPI from "../../api/goals.js";
  import ButtonLink from "../../components/ButtonLink.svelte";
  import Goal from "../../components/Goal.svelte";

  let userData;
  let currentGoals = [];
  let challenges;

  onMount(async () => {
    document.title = "Dashboard || Pawgress";
    try {
      const response = await UserApi.getDashboardData();
      userData = response.data.user;
      console.log("user", userData);
      userState.set(userData);
      challenges = userData.challenges;
      console.log(challenges, "challenges");

      const currentGoalsResponse = await GoalAPI.getCurrentGoals();
      currentGoals = currentGoalsResponse.data.goals;
      goalStore.update((state) => ({
        ...state,
        currentGoals: currentGoalsResponse.data.goals,
      }));

      console.log("current goals", currentGoalsResponse.data.goals);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  });
</script>

<div class="dashboard-container">
  {#if userData}
    <h2>Welcome back, {userData.firstName}!</h2>

    <div class="flex-row">
      <NewLog className="small" />

      <div class="flex-column">
        <div class="card">
          <div class="flex-row heading">
            <h3>Current goals</h3>
            <ButtonLink
              text="View all"
              path="/goals"
              className="plain-btn"
            />
          </div>

          <div class="flex-row">
            <div>
              {#each currentGoals.slice(0, 2) as currentGoal}
                <Goal goal={currentGoal} className="small" achievedGoalClass=""/>
              {/each}
            </div>
            <img
              src="dash-goals.svg"
              alt="dog-illustration"
            />
          </div>
        </div>
        <div class="card">
          <div class="flex-row heading">
            <h3>Current challenges</h3>
            <ButtonLink
              text="View all"
              path="/challenges"
              className="plain-btn"
            />
          </div>
          <div class="flex-row">
            <div>
              {#each challenges.slice(0, 3) as challenge}
                <div class="goal-card">
                  <h5>{challenge.challenge.name}</h5>
                </div>
              {/each}
            </div>
          <img
          src="dash-chall.svg"
          alt="dog-illustration"
        />

          </div>

      
      
        </div>
      </div>
    </div>
  {/if}
</div>



<style>


  .flex-row {
    gap: 30px;
  }

  .card {
    padding: 30px;
    border-radius: 25px;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
    background: #fcfcfd;
    color: #224762;
    height: 200px;
    width: 450px;
  }

  .flex-column {
    gap: 30px;
  }
  h3 {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 20px 0;
  }

  img {
    max-width: 150px;
  }

  .card .flex-row {
    justify-content: space-between;
  }

  .flex-row.heading {
    align-items: flex-start;

  }

  h5 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 10px 0;
  }
</style>
