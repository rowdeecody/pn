Socket.IO client example

Node example

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { path: '/ws/v1' });

socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.emit('message', { type: 'REGISTER_PC', payload: { pcId: 1 } });
});

socket.on('message', (msg) => {
  console.log('server message', msg);
});
```

Browser example

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io('/', { path: '/ws/v1' });
  socket.on('connect', () => {
    console.log('connected', socket.id);
    socket.emit('message', { type: 'REGISTER_ADMIN' });
  });
  socket.on('message', (msg) => console.log('server message', msg));
</script>
```

Notes
- Use the `message` event with `{ type, payload }` objects to match the server message format.
- If you use a browser client, ensure the server serves the client script or include `socket.io-client` separately.

