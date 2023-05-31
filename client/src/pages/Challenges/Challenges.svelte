<script>
  import ChallengeAPI from "../../api/challenges.js";
  import ButtonLink from "../../components/ButtonLink.svelte";
  import PublicChallenge from "../../components/PublicChallenge.svelte";
  import { onMount, onDestroy } from "svelte";
  import { challengeStore } from "../../stores/challengeStore.js";
  import { Link } from "svelte-navigator";
  import JoinedChallenge from "../../components/JoinedChallenge.svelte";
  import userState from "../../stores/userStore.js";
  import UserAPI from "../../api/user.js";

  let user = null;
  let userChallenges = [];

  const unsubscribe = userState.subscribe((value) => {
    user = value;
    if (user && user.challenges) {
      userChallenges = user.challenges;
      updateChallengeStore();
      console.log("User Challenges: ", userChallenges);
    }
  });
  let handleTaskCompletion = async (challengeId, taskId) => {
    let updatedChallenge = {};


    userState.update((user) => {
      updatedChallenge = user.challenges.find(
        (chal) => chal.challenge._id === challengeId
      );
      return user; 
    });


    let completedTask = updatedChallenge.tasksStatus.find(
      (task) => task.task === taskId
    );


    if (!completedTask) {
      console.error(
        `Task with id ${taskId} not found in challenge with id ${challengeId}`
      );
      return;
    }


    let dataToUpdate = {
      _id: challengeId,
      tasksStatus: [
        {
          taskId: completedTask.task, 
          completed: !completedTask.completed,
        },
      ],
    };


    try {
 
      const updatedUser = await UserAPI.updateUserChallenge(dataToUpdate);
    

      userState.set(updatedUser.data);

      await updateChallengeStore();
    } catch (error) {
      console.error("Error updating user challenge:", error);
    }
  };

  async function updateChallengeStore() {
    try {
      const challengeReponse = await ChallengeAPI.getChallenges();
      const challenges = challengeReponse.data;
      let joinedChallengeIds = userChallenges.map(
        (userChallenge) => userChallenge.challenge._id
      );
      challengeStore.set(
        challenges.filter(
          (challenge) => !joinedChallengeIds.includes(challenge._id)
        )
      );
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  }

  onMount(() => {
    document.title = "Challenges | Pawgress";
    updateChallengeStore();


  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="dashboard-container">
  <div class="flex-row heading">
    <h2>Your challenges</h2>
    <ButtonLink
      path="/new-challenge"
      className="orange-btn"
      text="Submit challenge"
    />
  </div>

  <div class="flex-row user-challenges">
    {#each userChallenges as userChallenge}
      <JoinedChallenge
        challenge={userChallenge.challenge}
        onTaskCompletion={handleTaskCompletion}
      />
    {/each}
  </div>

  <div class="flex-row heading">
    <h2>Join challenges</h2>
    <ButtonLink
      text="View all"
      path="/all-challenges"
      className="plain-btn"
    />
  </div>

  <div class="grid-public-challenges">
    {#each $challengeStore.slice(0, 6) as challenge (challenge._id)}
      <Link to={`/challenge/${challenge._id}`}>
        <PublicChallenge {challenge} />
      </Link>
    {/each}
  </div>
</div>

<style>
  .grid-public-challenges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
  }

  .flex-row.heading {
    justify-content: space-between;
    width: 1000px;
    margin-bottom: 30px;
    align-items: flex-start;
  }

  .flex-row.user-challenges {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 60px;
  }

  h2 {
    margin-top: 0;
  }
</style>
