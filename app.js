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
const account = require('./js/account.js')
//Router for rendering the htmls
const render = require('./js/render.js')

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
    cookie: { secure: true } 
}))

//Render html pages
app.get('/', render.mainPage)

app.get('/room/:roomId', render.chatPage)

app.get('/login', render.loginPage)

app.get('/register', render.registerPage)

//Account management (use made API on main server)
app.get('/logout', account.logout)

app.post('/login', account.postLogin)

app.post('/register', account.postRegister)

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