const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
require('dotenv').config()
const mongoSession = require('connect-mongodb-session')(session)
const cors = require('cors')
const userRouter = require('./routers/UserRouter')
const TodoRouters = require('./routers/TodoRouter')

// create instance for the express
const app = express()

// Using cors policy
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))
const corsOption = {
    origin: ["http://localhost:3000","https://todo-list-fe-iota.vercel.app"],
    credentials: true
}

app.use(cors(corsOption))

// data fetch from front End
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy", 1)


//connect mongoDb and backEnd
mongoose.connect(process.env.DB)
    .then(() => console.log("Mongo DB connect successfully"))
    .catch((err) =>
        console.log("Trouble in connecting to MongoDB ", err))


// connect session and mongoDb
const stores = new mongoSession({
    uri: process.env.DB,
    collection: "Session1"
})

app.use(session({
    saveUninitialized: false,
    store: stores,
    resave: false,
    secret: process.env.key,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }

}))


app.listen(process.env.PORT, () => console.log("Server Run in 3001", process.env.PORT))

app.use(userRouter)
app.use(TodoRouters)