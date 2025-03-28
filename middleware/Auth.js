
const user_Model = require('../models/usersModels')

const isAuth = async (req, res, next) => {
    try {
        if (req.session.user) {
            const login = await user_Model.findOne({ email: req.session.user.email })
            if (login) {
                next()
            }
            else {
                return res.send({ success: false, message: "Email not found ,enter valid Email" })
            }
        }
        else {
            return res.send({ success: false, message: "Login and Try again" })
        }
    }
    catch (err) {
        console.log("Error in Authentication", err)
        return res.send({ success: false, message: "Error in Authentication" })
    }
}

module.exports = isAuth

