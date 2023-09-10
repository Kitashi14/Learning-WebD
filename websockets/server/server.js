import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


httpServer.listen(3000,()=>{
    console.log("server listening to port 3000....");
})
