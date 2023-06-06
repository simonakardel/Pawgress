import { writable } from "svelte/store";
import { io } from "socket.io-client";
import toastr from "toastr";
import userState from "./userStore";

const authState = writable({
  isAuthenticated: false,
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
    authState.update((state) => {
      if (state.socket) {
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
      toastr.error("Unathorized.");
    }
  });

  socket.on("disconnect", (reason) => {
    if (reason === "transport close") {
      socket.connect();
    }
  });

  socket.on("challenge-joined-successfully", (data) => {
    userState.update(() => data.user)
    toastr.success("Successfully joined challenge!")
  });

  socket.on("error", (data) => {
    toastr.error(data.message);
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
