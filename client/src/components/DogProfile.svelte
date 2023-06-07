<script>
  import userState from "../stores/userStore.js";
  import { onMount, onDestroy } from "svelte";
  import UserAPI from "../api/user.js";
  import toastr from "toastr";

  let selectedImage = null;
  let imagePreview;
  let form;
  let breed;
  let weight;
  let dogName;
  let dob;
  let unsubscribe;
  let user;

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

  async function handleSaveButtonClick() {
    try {
      const updatedUser = {
        ...user,
        dog: {
          name: dogName,
          weight: weight,
          dateOfBirth: dob,
          breed: breed,
        },
      };

      const response = await UserAPI.updateUserData(updatedUser);
      if (response.status === 200) {
              userState.update(() => response.data);
              toastr.success("Successfully updated dog profile");
      } else {
        toastr.error("There was an error while updating profile.");
      }

    } catch (error) {

      toastr.error("There was an error while updating profile.");
    }
  }

  function handleCancelButtonClick(){
    weight = user?.dog?.weight;
    dogName = user?.dog?.name;
    breed = user?.dog?.breed;
    dob = user?.dog?.dateOfBirth;
  }
  

  onMount(() => {
    unsubscribe = userState.subscribe((updatedUser) => {
    user = updatedUser;
    weight = user?.dog?.weight;
    dogName = user?.dog?.name;
    breed = user?.dog?.breed;
    dob = user?.dog?.dateOfBirth;
    if (dob) {
    let date = new Date(dob);
    dob = date.toISOString().split('T')[0];}
  });
  
  });

  onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
  
</script>

<form bind:this={form}>
  <div class="form-grid">
    <label for="photo">Photo</label>
    <div class="flex-row image">
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
    <input
      type="text"
      name="name"
      bind:value={dogName}
    />
    <label for="breed">Breed</label>
    <input
      type="text"
      name="breed"
      bind:value={breed}
    />
    <label for="dob">Date of Birth</label>
    <input
      type="date"
      name="dob"
      bind:value={dob}
    />
    <label for="weight">Current weight</label>
    <div class="flex-row weight">
         <input
      type="number"
      name="weight"
      min="1"
      bind:value={weight}
    />
<p>kg</p>
    </div>
 
  </div>

  <div class="flex-row btn-group">
    <button class="button grey-btn" on:click|preventDefault={handleCancelButtonClick}>Cancel</button>
    <button
      class="button orange-btn"
      on:click|preventDefault={handleSaveButtonClick}>Save</button
    >
  </div>
</form>

<style>
  .img-div {
    width: 80px;
    height: 80px;
    border-radius: 75px;
    background: grey;
    overflow: hidden;
    object-fit: contain;
  }

  .img-div img {
    width: 100%;
    height: 100%;
  }

  .form-grid {
    max-width: 700px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 90px;
  }

  .button {
    height: 45px;
  }
  .btn-group {
    margin-top: 30px;
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

  .flex-row.image {
    gap: 10px;
  }

  .flex-row.weight {
    gap: 10px;
  }
</style>
