import { io } from "socket.io-client";
export const socket = io("http://192.168.178.20:4000", {
  transports: ["websocket"],
});