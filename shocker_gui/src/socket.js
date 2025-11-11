import { io } from "socket.io-client";
const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

export const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});
