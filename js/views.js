const url = require('url');

let authorizedRooms = []

exports.authorizedRooms = authorizedRooms

exports.mainPage = (req, res) => {
    if (req.session.isLogged) { //If person is logged we can move on and create their room
        let id = GetId()
        authorizedRooms.push(id)
        res.redirect('/room/' + id)
    }
    else //If not back the person to login and register page
        res.render('index')
}

//This function handle getting into room functionality
exports.chatPage = (req, res) => {
    if (req.session.isLogged) { //If person is logged in and room is authorized we can put user in room
        if (authorizedRooms.includes(req.params.roomId))
            res.render('index', { isLogged: req.session.isLogged, username: req.session.username, roomId: req.params.roomId })
        else
            res.redirect('/')
    }
    else
        res.render('index')
}

exports.loginPage = (req, res) => {
    if (req.session.isLogged)
        res.redirect('/')
    else
        res.render('login')
}

exports.registerPage = (req, res) => {
    if (req.session.isLogged)
        res.redirect('/')
    else
        res.render('register')
}

function GetId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}