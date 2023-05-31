import { writable } from "svelte/store";

const userState = writable(null);

export default userState;
