import { io } from "socket.io-client";
const host =  import.meta.env.VITE_HOST || "localhost";
const port = import.meta.env.VITE_PORT || "4000";
const production = import.meta.env.VITE_PRODUKTION === "true"


export const socket = io( production ? window.location.origin : `http://${host}:${port}`, {
  path: '/socket.io',
  transports: ["websocket"],
});
