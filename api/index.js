const express=require('express')
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const helmet=require('helmet')
const morgan = require('morgan');
const userrouter=require('./routes/users')
const authrouter=require('./routes/auth')
const postrouter=require('./routes/post')
const conversationrouter=require('./routes/conversation')
const messagerouter=require('./routes/messages')
const notificationrouter=require('./routes/notification')
const Auth=require("./middleware/admin")
const port=process.env.PORT || 5000
var cors = require('cors')
const path=require('path'
)

dotenv.config()
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>console.log("Mongodb connected"))
app.use('/images',express.static(path.join(__dirname,"public/images")))

app.use(cors())
app.use(express.json())

app.use("/api/users",Auth,userrouter)
app.use("/api/auth",authrouter)
app.use("/api/posts",Auth,postrouter)
app.use("/api/conversation",Auth,conversationrouter)
app.use("/api/messages",Auth,messagerouter)
app.use("/api/notifications",Auth,notificationrouter)
app.use(helmet())
app.use(morgan('common'))
app.listen(port,()=>{
    console.log("connected")
})