
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {addUser , 
    getUser,
    getUsersInRoom,
    removeUser} = require('./utils/users')
const { generateMessage , generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
var filter = new Filter()

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join' , ({username , room} , callback)=>{
        const {error , user}=addUser({id : socket.id , username , room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

    socket.emit('message' , generateMessage( 'Admin', `Welcome ${user.username}`))
    socket.broadcast.to(user.room).emit('message' , generateMessage('Admin',`${user.username} has joined ${user.room}`)) 
    io.to(user.room).emit('roomData' , {
        room : user.room,
        users : getUsersInRoom(user.room)
    })
    
    callback()
    })
 
    socket.on('sendMessage' , (msg , callback)=>{
        
        if (filter.isProfane(msg)) {
            return callback("Profanity is Not Allowed")
        } 
        
        const user = getUser(socket.id)
          io.to(user.room).emit('message' , generateMessage(user.username ,msg))
          callback()
    })

    socket.on('sendLocation' , (locCords , callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage' , generateLocationMessage( user.username,`https://google.com/maps?q=${locCords.latitude},${locCords.longitude}`))
        callback()
    })

    

    socket.on('disconnect' , ()=>{
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message' , generateMessage( 'Admin', `${user.username} has left the room!`)) 
            io.to(user.room).emit('roomData' , {
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }
        
    })
}) 
 
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

