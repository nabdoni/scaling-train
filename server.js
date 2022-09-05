const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { formatMessage, formatUser } = require('./utils/messages')
const { userJoin, getUserById, userLeaves, getUsers, checkIfNab } = require('./utils/users')
const { startIt, pauseIt, stopIt } = require('./utils/video')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//statics
app.use(express.static(path.join(__dirname, 'public')));

//getting username from params
const botName = 'Nabbot';

//connection listener
io.on('connection', socket => {
    socket.on('joinFun', (username) => {
        const user = userJoin(socket.id, username, username === "Nab" ? true : false);
        io.emit('allUsers', getUsers());
        //welcome message to user
        socket.emit('message', formatMessage(botName, `Welcome to the show, ${username}!`));
        if (user.isNab) {
            socket.emit('checkNab', 'Nab!');
        }
        //broadcasted connect message
        socket.broadcast.emit('message', formatMessage(botName, `${username} has joined in the fun!`));
    })


    //disconnect message
    socket.on('disconnect', (username) => {
        const user = userLeaves(socket.id);
        if (user) {
            io.emit('message', formatMessage(botName, `${user[0].username} has left :(`));
            io.emit('allUsers', getUsers());
        }
    })

    //chat message listener

    socket.on('chatMessage', (msg) => {
            const user = getUserById(socket.id);
            io.emit('message', formatMessage(user.username, msg));
        })
        // play request
    socket.on('play', () => {
        io.emit('globalPlay');
    });

    // pause request
    socket.on('pause', () => {
        io.emit('globalPause');
    });

    socket.on('vidid', (elem) => {
        io.emit('globalVid', elem);
    });
})





const P0RT = process.env.PORT || 3000;

server.listen(P0RT, () => console.log(`Server running and listening on ${P0RT}`));