<script>
  import { onMount } from "svelte";
  import authStore from "../stores/authStore.js";
  import { navigate } from "svelte-navigator";
  import toastr from "toastr";

  onMount(async () => {
    let isAuthenticated;
    const unsubscribe = authStore.subscribe((value) => {
      isAuthenticated = value;
    });

    if (!isAuthenticated) {
      toastr.error("Unathorized");
      navigate("/login");
    } 

    return () => {
      unsubscribe();
    };
  });
</script>

<slot />
