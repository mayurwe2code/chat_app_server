const express = require("express");
const app = express(); 
const cors  = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);

//mongoose connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://mayurwe2code:kN58MwBDS3wxQ06H@cluster0.p5jwu9n.mongodb.net/chat_app?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("DB Connection Successful!")
    }).catch((err) => console.log(err));

 const server = app.listen(10000, ()=>{
    console.log(`Server started on Port ${10000}`);
});

const io = socket(server,{
    cors: {
        origin: "https://chat-app-server-ri8t.onrender.com",
        credentials: true,
    },
});
//store all online users inside this map
global.onlineUsers =  new Map();
 
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved",data.message);
        }
    });
});
