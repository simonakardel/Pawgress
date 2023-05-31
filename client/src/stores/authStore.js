import { writable } from "svelte/store";
import { io } from "socket.io-client";
import toastr from "toastr";

const authState = writable({
  isAuthenticated: false,
  user: null,
  socket: null,
});

export default {
  subscribe: authState.subscribe,
  login: () => {
    authState.update((state) => ({ ...state, isAuthenticated: true }));
    setupSocketConnection();
  },
  logout: () => {
    closeSocketConnection();
    authState.update((state) => ({ ...state, isAuthenticated: false }));
  },
  joinChallenge: (challengeId) => {
    console.log('Emitting join-challenge event');
    authState.update((state) => {
      if (state.socket) {
        console.log('Emitting join-challenge event');
        state.socket.emit("join-challenge", { challengeId });
      }
      return state;
    });
  },
};

function setupSocketConnection() {
  const socket = io('http://localhost:8080', {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  authState.update((state) => ({ ...state, socket }));

  socket.on("connect_error", (err) => {
    if (err.message === "Authentication error") {
      console.log("Authentication error. Reconnecting...");
    }
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("user-joined-challenge", (data) => {
    console.log(`User ${data.userId} joined challenge ${data.challengeId}`);
  });

  socket.on("user-joined", (data) => {
    toastr.success(data.message);
  });

  socket.connect();
}

function closeSocketConnection() {
  authState.update((state) => {
    if (state.socket) {
      state.socket.disconnect();
    }
    return { ...state, socket: null };
  });
}
