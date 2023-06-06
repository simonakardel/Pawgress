<script>
  import { navigate } from "svelte-navigator";
  import toastr from "toastr";
  import AuthAPI from "../../api/auth.js";
  import Logo from "../../components/Logo.svelte";
  import { onMount } from "svelte";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let repeatPassword = "";

  async function handleSubmit() {
    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    if (password !== repeatPassword) {
      toastr.error("Passwords do not match!");
      return;
    }

    try {
      const response = await AuthAPI.register(data);

      if (response.status === 200) {
        toastr.success("Account created successfully!");
        navigate("/login");
      } else {
        const errorMessage = response.data.message;
        toastr.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toastr.error(`Error: ${error.message}`);
    }
  }

  onMount(() => {
    document.title = "Signup || Pawgress";
  });
</script>

<main>
  <Logo color="" />
  <div class="login-container">
    <div class="flex-column first">
      <h2>Create an account</h2>
      <p>Please enter your details.</p>
    </div>
    <form
      class="flex-column"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="flex-row">
        <div class="flex-column name">
          <label
            for="firstName"
            class="input-label">First Name</label
          >
          <input
            type="text"
            name="firstName"
            required
            class="login-input"
            placeholder="Enter your first name"
            bind:value={firstName}
          />
        </div>
        <div class="flex-column name">
          <label
            for="lastName"
            class="input-label">Last Name</label
          >
          <input
            type="text"
            name="lastName"
            required
            class="login-input"
            placeholder="Enter your last name"
            bind:value={lastName}
          />
        </div>
      </div>
      <div class="flex-column">
        <label
          for="email"
          class="input-label">Email</label
        >
        <input
          type="email"
          name="email"
          required
          class="login-input"
          placeholder="example@gmail.com"
          bind:value={email}
        />
      </div>
      <div class="flex-column">
        <label
          for="password"
          class="input-label">Password</label
        >
        <input
          type="password"
          name="password"
          required
          class="login-input"
          bind:value={password}
        />
      </div>
      <div class="flex-column">
        <label
          for="repeat-pass"
          class="input-label">Repeat password</label
        >
        <input
          type="password"
          name="repeat-pass"
          required
          class="login-input"
          bind:value={repeatPassword}
        />
      </div>
      <button
        type="submit"
        class="login-btn btn">Sign up</button
      >
      <p class="small-p">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </form>
  </div>
</main>

<style>
  .login-container {
    margin: 8vh auto;
    width: 450px;
    text-align: center;
  }

  .flex-row {
    justify-content: stretch;
    gap: 4%;
    margin-top: 20px;
  }

  .name {
    width: 48%;
  }

  h2,
  p {
    margin: 0;
  }
</style>
