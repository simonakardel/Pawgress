<script>
  import AuthAPI from "../api/auth.js";
  import authStore from "../stores/authStore.js";
  import { navigate } from "svelte-navigator";
  import toastr from "toastr";

  async function handleLogout() {
    try {
      const response = await AuthAPI.logout();
      authStore.logout();
      toastr.success(response.data);
      navigate("/");
    } catch (error) {
      toastr.error(error);
    }
  }
</script>

<button
  on:click={handleLogout}
  class="log-out-btn"><i class="fa-solid fa-arrow-right-from-bracket" /></button
>

<style>
  .log-out-btn {
    height: 40px;
    width: 30px;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 500;
    background: #dae0e4;
    color: #224762;

    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }

  .log-out-btn i {
    padding: 0 7px;
  }
</style>
