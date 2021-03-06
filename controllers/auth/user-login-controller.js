const bcrypt = require('bcrypt')
const User = require('../../database/models/auth/User')
 
module.exports = (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({
        username
    }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id
                    res.redirect('/')
                } else {
                    res.redirect('/auth/login')
                }
            })
        } else {
            return res.redirect('/auth/login')
        }
    })
}