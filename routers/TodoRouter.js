const express = require('express')

const Todo_Model = require('../models/TodoListData')
const Auth = require('../middleware/Auth')


const TodoRouter = express.Router()

//create todolist 
TodoRouter.post('/create_todo', async (req, res) => {
    try {

        const { event, times } = req.body

        if (!event || !times) {
            return res.send({ success: false, message: "All fields are required" })
        }
        else {
            let todo = await Todo_Model.find({});
            let TodoId;
            if (todo.length > 0) {
                let lastId = todo.slice(-1)[0];
                TodoId = lastId.id + 1;
            } else {
                TodoId = 1
            }


            const new_todo = new Todo_Model({
                id: TodoId,
                list: event,
                schedule: times
            })

            const save_todo = await new_todo.save()

            if (save_todo) {
                return res.send({ success: true, message: "Todo List saved successfull" })
            }

            else {
                return res.send({ success: false, message: "Something wrong in saved list " })
            }
        }
    }
    catch (err) {

        console.log("Network issue on the create account", err)
        return res.render('error', { message: "Server error please try again later" })
    }

})

// Update the Todo List

TodoRouter.post('/update_todo/:id', Auth, async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { event, times } = req.body


        if (id) {
            const update_todolist = await Todo_Model.updateOne({ id }, {
                $set: {
                    list: event,
                    schedule: times
                }
            })

            if (update_todolist.modifiedCount > 0) {
                return res.status(200).send({ success: true, message: "Update List  successfull" })
            }
            else {
                return res.status(400).send({ success: false, message: "Not Update" })
            }
        }
        else {
            return res.status(404).send({ success: false, message: " Product id not found" })
        }

    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.status(500).send({ success: false, message: " Server error please try again later" })
    }
})

// Delete todolist

TodoRouter.delete('/delete_todolist/:id', Auth, async (req, res) => {
    try {
        const id = Number(req.params.id)
        console.log(id)

        if (id) {
            const find_id = await Todo_Model.findOne({ id: id })
            if (find_id) {
                const delete_id = await Todo_Model.deleteOne({ id: find_id.id })
                if (delete_id) {
                    return res.status(200).send({ success: true, message: ` Delete Todo successfully ` })
                }
                else {
                    return res.status(400).send({ success: false, message: "Not Deleted" })
                }
            }
            else {
                return res.status(404).send({ success: false, message: "Todo List id not found" })
            }

        }
        else {
            return res.status(404).send({ success: false, message: "Todo List id not found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.status(500).send({ success: false, message: " Server error please try again later" })
    }
})

//get the todolist
TodoRouter.get('/todolists', async (req, res) => {
    try {
        const all_todolist = await Todo_Model.find({})

        if (all_todolist) {
            return res.status(200).send({ success: true, alllists: all_todolist })
        }
        else {
            return res.status(404).send({ success: false, message: " Todo id  not found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.status(500).send({ success: false, message: " Server error please try again later" })
    }
})
//get the particular todolist
TodoRouter.get('/todolists/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const one_todolist = await Todo_Model.findOne({ id })


            if (one_todolist) {
                return res.status(200).send({ success: true, todo: one_todolist })
            }
            else {
                return res.status(400).send({ success: false, message: "Not data" })
            }
        }
        else {
            return res.status(404).send({ success: false, message: " Todo id not found" })
        }
    }
    catch (err) {
        console.log("Network issue on the create account", err)
        return res.status(500).send({ success: false, message: " Server error please try again later" })
    }
})

module.exports = TodoRouter