/** @format */
// import { Server } from "socket.io";
const { Server } = require("socket.io");
const Chat = require("./chatModel");

const startSocket = async (httpServer) => {
  try {
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:8080",
      },
    });
    var count = 0;
    var onlineUsers = new Map();
    io.on("connection", (socket) => {
      console.log("new user joined : ", socket.id);
      count++;
      console.log("connected users : ", count, "\n");

      socket.on("joined", async (data) => {
        try {
          console.log("got join request\n");
          var users = [];
          onlineUsers.forEach((val, key) => {
            users.push(val);
          });

          const oldData =await Chat.find(
            {
              $or : [{from : data.userName}, {to: data.userName}],
            }
          ).sort(
            {
              time : 1
            }
          );

          console.log("sending online users info and his data\n");
          socket.emit("initial info", {
            onlineUsers : users,
            oldData
          });
          socket.join(data.userName);
          console.log("sending broadcast for new online user");
          socket.broadcast.emit("joined", data);
          onlineUsers.set(socket.id, {
            userName: data.userName,
          });
        } catch (err) {
          console.log(err);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("disconnected : ", reason);
        count--;
        if (onlineUsers.has(socket.id)) {
          console.log("sending braodcast for left user\n");
          socket.broadcast.emit("left", onlineUsers.get(socket.id).userName);
          onlineUsers.delete(socket.id);
        }
        console.log("connected users : ", count, "\n");
      });

      socket.on("send message", async (data) => {
        console.log("new send message request : ", data);
        try {
          if(!data.from || !data.to || !data.message) {
            throw Error("Data not defined properly");
          }
          const newMessage = new Chat({
            from: data.from,
            to: data.to,
            message: data.message,
            time: data.time,
            status: "delivered",
          });

          await newMessage.save();
          console.log("sending sender ack");
          socket.emit("server received message", {
            status: true,
            data: newMessage,
          });
          console.log("sending message to receiver");
          socket.to(data.to).emit("new message", newMessage);
        } catch (err) {
          console.log(err, "\n");
          console.log("sending sender ack");
          socket.emit("server received message", {
            status: false,
            data: data,
          });
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.startSocket = startSocket;
