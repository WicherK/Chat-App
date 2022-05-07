const axios = require('axios')

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

exports.postLogin = (req, res) => {
    axios.post('https://ravenstudio.ga/login', {
        USERNAME: req.body.USERNAME,
        PASSWORD: req.body.PASSWORD
    })
    .then((response) => {
        //console.log(response.data)
        if (response.data.status == true) {
            req.session.isLogged = true
            req.session.username = req.body.USERNAME
            res.redirect('/')
        }
        else
            res.render('login', { status: response.data.status, message: response.data.message })
    })
    .catch((error) => {
        //console.log(error)
    })
}

exports.postRegister = (req, res) => {
    axios.post('https://ravenstudio.ga/create', {
        USERNAME: req.body.USERNAME,
        EMAIL: req.body.EMAIL,
        PASSWORD: req.body.PASSWORD,
        REPEATPASSWORD: req.body.REPEATPASSWORD,
    })
    .then((response) => {
        //console.log(response.data)
        res.render('register', { status: response.data.status, message: response.data.message })
    })
    .catch((error) => {
        //console.log(error)
    })
}