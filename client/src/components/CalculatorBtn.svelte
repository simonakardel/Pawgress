<script>
  export let label;
  export let value;
  export let selected;
  export let handleClick;
  export let btnClass = "";
  export let useDataValue = false;
</script>

<button
  class={btnClass}
  class:selected
  data-value={useDataValue ? value : undefined}
  on:click={useDataValue
    ? ($event) => handleClick($event)
    : () => handleClick(value)}
>
  {label}
</button>

<style>
  .selected {
    background-color: #ec8b33;
    color: white;
  }

  button {
    width: 200px;
    height: 50px;
    background: #3688a6;
    color: white;
    font-size: 1rem;
    margin-right: 20px;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s ease-in-out;
  }

  button:active {
    transform: scale(0.9);
  }

  button.tall {
    height: 100px;
    padding: 20px;
  }
</style>
