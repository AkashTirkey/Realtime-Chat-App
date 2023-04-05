const path = require('path'); //express in built module
const http = require('http'); // " "
const express = require("express") // " "
const socketio = require('socket.io');// " "
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server); // initialize a var and set that/pass to server


//set static folder to use the contents of the folder in express we write
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot';


// run when client connects, event callback() 
// an arrow () where socket is passed as  a parameter
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // this method allows to show the message for individual client
        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        //Broadcast when a user connects, it is basically be shown to all the clients except the client is connecting
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`));

        //Send users & room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg)); // eveyone will receive this msg
    })

    // this method will allow to display the message  to all the clients in general!
    // =>io.emit();

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message', formatMessage(botName, `${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`)
// });

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})