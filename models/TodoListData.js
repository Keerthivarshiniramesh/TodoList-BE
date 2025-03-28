const mongoose = require('mongoose')


const Todo_schema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    list: { type: String, required: true },
    schedule: { type: Date, required: true }

})

const Todo_Model = mongoose.model("TodoList", Todo_schema)

module.exports = Todo_Model