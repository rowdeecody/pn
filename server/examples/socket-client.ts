/**
 * Example Socket.IO client (Node)
 * Usage:
 *   npm install socket.io-client
 *   ts-node examples/socket-client.ts
 */

import { io } from 'socket.io-client';

type Message = { type: string; payload?: any };

const socket = io('http://localhost:3000', { path: '/ws/v1' });

socket.on('connect', () => {
    console.log('connected', socket.id);
    // register this client as a PC with id 1
    socket.emit('message', { type: 'REGISTER_PC', payload: { pcId: 1 } });
});

socket.on('message', (msg: Message) => {
    console.log('server message', msg);
    if (msg.type === 'COMMAND') {
        // example: handle commands from server
        console.log('Command received:', msg.payload);
    }
});

socket.on('disconnect', () => {
    console.log('disconnected');
});

