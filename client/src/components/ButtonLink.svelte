<script>
  import { Link } from "svelte-navigator";
  export let path;
  export let text;
  export let className;
</script>

<div class="button {className}">
  <Link to={path}>{text}</Link>
</div>

<style>
  .orange-btn {
    background: #f4ba41;
    color: white;
    width: 150px;
  }

  .orange-btn:hover {
    color: #0a3960;
    background: #ffd170;
  }

  .dark-btn {
    background: #0a3960;
    color: white;
  }

  .dark-btn:hover {
    background: #224762;
    color: white;
  }

  .grey-btn {
    background: #D0D5DD;
    color: #0a3960;
  }

  .grey-btn:hover {
    background: #EAECF0
    
  }

  .plain-btn {
    padding: 0;
    font-size: 14px;
    color: #96A5B0;

  }


</style>
