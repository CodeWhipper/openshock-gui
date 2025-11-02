import { io } from "socket.io-client";
const host = import.meta.env.VITE_HOST || "localhost";
const port = import.meta.env.VITE_PORT || "4000";

export const socket = io(`http://${host}:${port}`, {
  transports: ["websocket"],
});
