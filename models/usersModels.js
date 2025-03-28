const mongoose = require('mongoose')

const User_Schema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }
})

const UserModel = mongoose.model("User", User_Schema)

module.exports = UserModel