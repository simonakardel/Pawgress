<script>
  import { navigate } from "svelte-navigator";
  import toastr from "toastr";
  import ContactAPI from "../../api/contact.js";
  import { onMount } from "svelte";

  let subject = "";
  let message = "";

  async function handleSubmit() {

    const data = {
      subject,
      message,
    };

    try {
      const response = await ContactAPI.sendMessage(data);

      if (response.status === 200) {
        toastr.success("Thank you for contacting us!");
        navigate("/dashboard");
      } else {
        const errorMessage = await response.data;
        toastr.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toastr.error(`Error: ${error.message}`);
    }
  }

  onMount(() => {
    document.title = "Contact || Pawgress";
  });

</script>

<div class="dashboard-container flex-row">
  <div>
    <h2 class="heading">Send us a message</h2>
    <form
      class="contact-form"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="flex-column">
        <label for="subject">Subject</label>
        <input
          type="text"
          placeholder="Enter subject"
          name="subject"
          bind:value={subject}
          required
        />
      </div>
      <div class="flex-column">
        <label for="message">Message</label>
        <textarea
          name="message"
          rows="15"
          bind:value={message}
        />
      </div>
      <div class="flex-row button-div">
        <button
          type="submit"
          class="submit-btn button">Send message</button
        >
      </div>
    </form>
  </div>

  <img
    src="dog-contact.svg"
    alt="wawing-dog-illustration"
  />
</div>



<style>
  .submit-btn {
    background: #0a3960;
    color: white;
    height: 48px;
  }

  .button-div {
    align-items: flex-end;
    justify-content: flex-end;
  }

  .contact-form {
    width: 500px;
  }

  img {
    max-width: 300px;
  }

  .dashboard-container.flex-row {
    justify-content: space-between;
    width: 900px;
  }
</style>
