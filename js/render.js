let authorizedRooms = []

exports.authorizedRooms = authorizedRooms

exports.mainPage = (req, res) => {
    if (req.session.isLogged) {
        let id = GetId()
        authorizedRooms.push(id)
        res.redirect('/room/' + id)
    }
    else
        res.render('index')
}

exports.chatPage = (req, res) => {
    if (req.session.isLogged) {
        if (authorizedRooms.includes(req.params.roomId))
            res.render('index', { isLogged: req.session.isLogged, username: req.session.username, roomId: req.params.roomId })
        else
            res.send("Room doesn't exist.")
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