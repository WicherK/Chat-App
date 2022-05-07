const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const path = require('path')
const session = require('express-session')
const secrets = require('./secrets.json') //Import some secrets authentication keys

//Routes for making requests
const api = require('./js/api.js')

//Router for rendering the htmls
const render = require('./js/views.js')

const PORT = 8081

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, '/views')) //Set static path to html pages

app.use(express.static(__dirname + '/public')) //Set public files to use

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)

app.use(session({
    secret: secrets.key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } //Remember to set it to true!
}))

//Render html pages
app.get('/', render.mainPage) //Render main page with login and register etc.

app.get('/room/:roomId', render.chatPage) //Getting into room with roomId

app.get('/login', render.loginPage) //Render main page with login 

app.get('/register', render.registerPage) //Render main page with register

//Account management (use made API on main server)
app.get('/logout', api.logout)

app.post('/login', api.postLogin)

app.post('/register', api.postRegister)

//Chat
io.on('connection', (socket) => {
    socket.on('join', (msg) => {
        //Create custom socket's variables
        socket.roomId = msg.roomId
        socket.username = msg.username

        socket.join(socket.roomId)
        io.to(socket.roomId).emit('message', '[Server] ' + socket.username + ' has joined to the room.')
    })

    socket.on('disconnect', (msg) => {          
        //Delete room on last person in room
        io.in(socket.roomId).allSockets().then(res => {
            if (res.size == 0) {
                let thisRoomIndex = render.authorizedRooms.indexOf(socket.roomId)
                render.authorizedRooms.splice(thisRoomIndex, 1)
            }
        })
        io.to(socket.roomId).emit('message', '[Server] ' + socket.username + ' has disconnected from the room.')
    })

    socket.on('send', (msg) => {
        let message = msg.message
        let roomId = msg.roomId
        io.to(roomId).emit('message', message)
    })
})

//Start server
server.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`)
})