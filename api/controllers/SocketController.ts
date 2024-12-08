import { io } from "socket.io-client"

const SERVER = process.env.EXPO_PUBLIC_SERVER || "localhost:3000"
console.log(SERVER)

const socket = io(SERVER)

socket.on("connection", () => {
  console.log("Connected to server")
})

socket.on("disconnect", () => {
  console.log("Disconnected from server")
})

export default socket