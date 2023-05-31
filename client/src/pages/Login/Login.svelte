<script>
  import { navigate } from "svelte-navigator";
  import { onMount } from "svelte";
  import toastr from "toastr";
  import "toastr/build/toastr.min.css";
  import authStore from "../../stores/authStore.js";
  import AuthAPI from "../../api/auth.js";
  import Logo from "../../components/Logo.svelte";
  import userState from "../../stores/userStore.js";

  let email = "";
  let password = "";

  async function handleSubmit() {
    const data = {
      email,
      password,
    };

    try {
      const response = await AuthAPI.login(data);
      if (response.status === 200) {
        authStore.login();
        userState.set(response.data);
        toastr.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        const errorMessage = response.data.message;
        toastr.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toastr.error(`Error: ${error.message}`);
    }
  }

  onMount(() => {
    document.title = "Login || Pawgress";
  });
</script>

<main>
  <Logo  color=""/>
  <div class="login-container">
    <div class="flex-column heading">
      <h2>Log in</h2>
      <p>Welcome back! Please enter your details.</p>
    </div>
    <form
      class="flex-column"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="flex-column">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="example@gmail.com"
          bind:value={email}
        />
      </div>
      <div class="flex-column">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          required
          bind:value={password}
        />
      </div>
      <button
        type="submit"
        class="login-btn">Log in</button
      >
      <p class="small-p">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </form>
  </div>
</main>

<style>
  .login-container {
    margin: 10vh auto;
    width: 450px;
    text-align: center;
  }

  .small-p {
    font-size: 14px;
    color: #51697b;
  }

  h2,
  p {
    margin: 0;
  }

  .heading {
    margin-bottom: 30px;
  }
</style>
