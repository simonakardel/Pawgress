<script>
  import authStore from "../stores/authStore.js";

  import { restrictParagraphLength } from "../utils/helperFunctions.js";
  export let challenge;

  let isChallengeVisible = false;


  const {
    _id: challengeId,
    name: challengeName,
    description: challengeDescription,
    createdBy: challengeAuthor,
  } = challenge;

  const toggleChallenge = () => {
    isChallengeVisible = !isChallengeVisible;
  };

  function handleJoinChallengeButton() {
    authStore.joinChallenge(challengeId);
  }
</script>

<div class="challenge-container">
  <div class="flex-row heading">
    <h4>{challengeName}</h4>
    <div>
      <button
        on:click|preventDefault={handleJoinChallengeButton}
        class="button join-challenge-btn"
        ><i class="fa-solid fa-plus" />Join</button
      >
    </div>
  </div>

  <div class="author">
    <p><i class="fa-solid fa-user" />{challengeAuthor}</p>
  </div>

  <p class="description">{restrictParagraphLength(challengeDescription)}</p>

  <div
    on:click={toggleChallenge}
    on:keydown={toggleChallenge}
  />
</div>

<style>
  .challenge-container {
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
    background: #fcfcfd;
    color: #224762;
    min-height: 250px;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  .join-challenge-btn {
    background: #3688a6;
    color: white;
    height: 35px;
  }

  .join-challenge-btn:hover {
    background: #90C2D3;
    color: #112f45;
  }

  .flex-row.heading {
    justify-content: space-between;
    align-items: flex-start;
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

  .description {
    font-weight: 400;
  }

  i {
    margin-right: 10px;
  }
</style>
