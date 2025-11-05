import { io } from "socket.io-client";
const host = import.meta.env.VITE_HOST || "node-backend";
const port = import.meta.env.VITE_PORT || "4000";

export const socket = io(window.location.origin, {
  path: '/socket.io',
  transports: ["websocket"],
});
