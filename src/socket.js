import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://carlbackend.fly.dev'

export const socket = io(URL , { transports: ["websocket"] });