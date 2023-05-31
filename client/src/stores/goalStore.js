import { writable } from 'svelte/store';

const initialGoals = {
    currentGoals: [],
    achievedGoals: []
};

const goalStore = writable(initialGoals);

export default goalStore;


