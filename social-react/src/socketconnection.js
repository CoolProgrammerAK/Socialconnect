import openSocket from "socket.io-client";

let socket = openSocket("ws://localhost:8900");
export default socket