<script>
  import userStore from "../stores/userStore.js";
  import { onDestroy } from "svelte";

  let userData = null;

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

{#if userData}
  <div class="flex-row">
    <div class="avatar-img">
      <img
        src="avatar.svg"
        alt="profile-img"
      />
    </div>
    <div>
      <p>{userData.firstName} {userData.lastName}</p>
      <p>{userData.email}</p>
    </div>
  </div>
{/if}

<style>
  .avatar-img {
    width: 45px;
    height: 45px;
    border-radius: 20px;
    margin-right: 10px;
  }

  img {
    width: 100%;
    object-fit: cover;
  }

  p {
    margin: 0;
    font-size: 14px;
    padding: 0;
  }

  .flex-row {
    padding: 0;
    margin: 0;
  }
</style>
