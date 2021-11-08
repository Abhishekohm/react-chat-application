import express from 'express';
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
import cors from "cors"

app.use(cors())


const rooms = new Map();
app.get('/getUsers', (req, res) => {
    const { room } = req.query
    if (rooms.has(room)) {
        res.json(rooms.get(room));
    } else {
        res.json([]);
    }
})



io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        for (const [room, users] of rooms.entries()) {
            const newUsers = users.filter((user) => user.id != socket.id)
            rooms.set(room, newUsers)
        }
        console.log(rooms.get('js'), "30")
        socket.to('js').emit('userExit', { newUsers: rooms.get('js') })
    })
    socket.on('JOIN', ({ id, username, room }) => {
        console.log("here")
        if (id) {
            if (rooms.has(room)) {
                rooms.set(room, [...rooms.get(room), { username, id }])
            }
            else {
                rooms.set(room, [{ username, id }]);
            }
            socket.join(room)
            socket.broadcast.to(room).emit('newUserJoin', { username, id })
        }
    })
    socket.on('message', ({ message, room }) => {
        socket.broadcast.to(room).emit('message', { message })
    })
});

const port = 5000

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
