import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://4bbb-149-43-203-109.ngrok-free.app'

export const socket = io(URL , { transports: ["websocket"] });