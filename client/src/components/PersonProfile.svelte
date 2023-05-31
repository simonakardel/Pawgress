<script>
  import { onMount } from "svelte";
  import UserAPI from "../api/user.js";
  import userState from "../stores/userStore.js";
  import toastr from "toastr";

  let user;
  let firstName;
  let lastName;

  let unsubscribe = userState.subscribe((updatedUser) => {
    user = updatedUser;
    firstName = user?.firstName;
    lastName = user?.lastName;
  });

  let selectedImage = null;
  let imagePreview;

  const handleFileChange = (e) => {
    selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  async function handleSaveButtonClick(e) {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        firstName,
        lastName,
      };

      const response = await UserAPI.updateUserData(updatedUser);
      if(response.status === 200) {
         userState.update(() => response.data);
         toastr.success("Profile updated");
      } else {
        toastr.error("There was an error");
      }

     
    } catch (error) {
      toastr.error("There was an error");
    }
  }

  onMount(() => {
    return unsubscribe;
  });
</script>

<form class="form-grid">
  <div>
    <label for="photo">Your photo</label>
    <p class="small-p">This will be displayed on your profile</p>
  </div>

  <div class="input-row flex-row">
    <div class="img-div">
      <img
        id="imagePreview"
        bind:this={imagePreview}
        alt=""
      />
    </div>
    <input
      type="file"
      bind:files={selectedImage}
      on:change={handleFileChange}
    />
  </div>
  <label for="name">Name</label>
  <div class="input-row">
    <input
      bind:value={firstName}
      type="text"
      name="firstName"
      class="short-input"
    />
    <input
      type="text"
      bind:value={lastName}
      name="lastName"
      class="short-input"
    />
  </div>
  <label for="email">Email address</label>
  <input
    type="text"
    value={user.email}
    name="email"
    class="long-input"
    disabled
  />

  <label for="password">Password</label>
  <input
    type="password"
    name="password"
    value={user.password}
    class="long-input"
    disabled
  />
  <div />
  <div class="flex-row btn-group">
    <button class="button grey-btn">Cancel</button>
    <button
      class="button orange-btn"
      on:click={handleSaveButtonClick}>Save</button
    >
  </div>
</form>

<style>
  .form-grid {
    max-width: 700px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 90px;
  }
  .input-row {
    display: flex;
    gap: 10px;
  }

  input {
    height: 40px;
  }

  .short-input {
    width: 200px;
  }

  .long-input {
    width: 410px;
  }

  .img-div {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background: grey;
    overflow: hidden;
    object-fit: contain;
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
    box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  }

  .img-div img {
    width: 100%;
    height: 100%;
  }

  .small-p {
    font-size: 12px;
    color: grey;
  }
  .button {
    height: 45px;
  }
  .btn-group {
    justify-content: flex-end;
  }

  .orange-btn {
    background: #f4ba41;
    color: white;
  }

  .orange-btn:hover {
    color: #0a3960;
    background: #ffd170;
  }

  .grey-btn {
    background: #dae0e4;
    color: #0a3960;
  }

  .grey-btn:hover {
    background: #f0f4f6;
  }
</style>
