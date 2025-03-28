const express = require('express')

const user_Model = require('../models/usersModels')
const Auth = require('../middleware/Auth')
const { Schema } = require('mongoose')


const UserRouter = express.Router()


UserRouter.post('/register', async (req, res) => {
    try {

        const { Name, Email, Pwd } = req.body

        if (!Name || !Email || !Pwd) {
            return res.send({ success: false, message: "All fields are required" })
        }
        else {
            let Users = await user_Model.find({});
            let userId;
            if (Users.length > 0) {
                let last_user = Users.slice(-1)[0];
                userId = last_user.id + 1;
            } else {
                userId = 1
            }

            const old_email = await user_Model.findOne({ email: Email })
            if (old_email) {
                return res.send({ success: false, message: "Already Sign Up" })
            }
            else {
                const new_user = new user_Model({
                    id: userId,
                    name: Name,
                    email: Email,
                    password: Pwd
                })

                const save_user = await new_user.save()

                if (save_user) {
                    return res.send({ success: true, message: "Sign Up Successfull" })
                }

                else {
                    return res.send({ success: false, message: "Something wrong in sign Up " })
                }
            }
        }

    }
    catch (err) {

        console.log("Network issue on the create account", err)
        return res.render('error', { message: "Server error please try again later" })
    }

})

// login router
UserRouter.post('/login', async (req, res) => {
    try {

        const { Email, Pwd } = req.body
        console.log(Email, Pwd)

        if (!Email || !Pwd) {
            return res.send({ success: false, message: "All fields are required" })
        }
        else {

            const login_user = await user_Model.findOne({ email: Email })

            if (login_user) {
                req.session.user = { username: login_user.name, email: login_user.email, password: login_user.password }
                return res.send({ success: true, message: "Sign in Successfull", user: req.session.user })
            }

            else {
                return res.send({ success: false, message: "Something wrong in Sign In " })
            }
        }
    }
    catch (err) {

        console.log("Network issue on the create account", err)
        return res.render('error', { message: "Server error please try again later" })
    }

})

// Logout user
UserRouter.get('/logout', Auth, (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.send({ succes: false, message: "Some thing error in logout." })

            }
            return res.send({ succes: true, message: "Logout Successfull" })
        })
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.render('error', { message: "Server error please try again later" })
    }
})

module.exports = UserRouter
