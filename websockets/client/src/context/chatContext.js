/** @format */

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AuthContext from "./authContext";
import { toast } from "react-toastify";
import { socket } from "../sc";

const ChatContext = createContext({
  chatBox: null,
  setChatBox: function (data) {},
});

export const ChatContextProvider = (props) => {
  const auth = useContext(AuthContext);
  
  class User {
    constructor(otherParty) {
      this.userName = otherParty;
      this.latestMessage = 0;
      this.messages = [];
    }

    getName() {
      return this.userName;
    }

    addMessage(data) {
      var date = new Date(data.time);

      if (this.latestMessage < date || !this.latestMessage)
      this.latestMessage = date;
      this.messages.push(data);
    }

    async sendMessage(from,message) {
      var currTime = new Date();
      var stat = "Not Delivered";
      var to = this.userName;

      try {
        //socket call
        const messageObj = {
          from,
          to,
          message,
          status : stat,
          time : currTime
        }
        socket.emit("send message", messageObj);
      } catch (err) {
        console.log(err);
        toast.error("Message can't be send.");
        this.latestMessage = currTime;
        this.messages.push({
          time: currTime,
          status: stat,
          from,
          to,
          message,
          id: null,
        });
      }
    }

    async clientSaw(authUser) {
      var ids = this.messages.filter((data) => {
        return (
          data.to == authUser &&
          (data.status == "received" || data.status == "delivered")
        );
      });

      try {
        //socket call
      } catch (err) {
        console.log(err);
      }
    }

    otheruserSaw(ids) {
      for (var j = 0; j < this.messages.length; j++) {
        var id = this.messages[j].id;
        for (var i = 0; i < ids.length; i++) {
          if (id == ids[i]) {
            this.messages[j].status = "seen";
          }
        }
      }
    }

    async clientReceived(authUser) {
      var ids = this.messages.filter((data) => {
        return data.to == authUser && data.status == "delivered";
      });

      try {
        //socket call
      } catch (err) {
        console.log(err);
      }
    }

    otheruserReceived(ids) {
      for (var j = 0; j < this.messages.length; j++) {
        var id = this.messages[j].id;
        for (var i = 0; i < ids.length; i++) {
          if (id == ids[i]) {
            this.messages[j].status = "received";
          }
        }
      }
    }
  }

  class ChatBox {
    constructor() {
      this.userIndex = new Map();
      this.users = [];
      this.onlineUsers = [];
    }

    addData(authUser,data) {
      data.map((row) => {
        var otherParty = row.from == authUser ? row.to : row.from;
        if (this.userIndex.has(otherParty)) {
          var i = this.userIndex.get(otherParty);
          this.users[i].addMessage(row);
        } else {
          const user = new User(otherParty);
          user.addMessage(row);
          this.users.push(user);
          this.userIndex.set(otherParty, this.users.length - 1);
        }
      });

      this.users.sort((a, b) => {
        return b.latestMessage.getTime() - a.latestMessage.getTime();
      });
      for (var i = 0; i < this.users.length; i++) {
        this.userIndex.set(this.users[i].getName(), i);
        this.users[i].clientReceived();
      }
    }

    async send(from,name, message) {
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length - 1;
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(from,message);
        this.users[0] = temp;
        this.userIndex.set(name, 0);
      } else {
        var idx = this.userIndex.get(name);
        var temp = this.users[idx];
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(from,message);
        this.users[0] = temp;
        this.userIndex.set(this.users[0].getName(), 0);
      }
    }

    addMessage(name, data) {
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length - 1;
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        temp.addMessage(data);
        this.users[0] = temp;
        this.userIndex.set(name, 0);
      } else {
        var idx = this.userIndex.get(name);
        var temp = this.users[idx];
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        temp.addMessage(data);
        this.users[0] = temp;
        this.userIndex.set(this.users[0].getName(), 0);
      }
    }

    isUserPresent(name) {
      var userFound = this.users.filter((user) => {
        return user.userName == name;
      });

      if (userFound.length > 0) return userFound[0];
      return false;
    }

    addOnlineUser(data) {
      this.onlineUsers.push(data);
    }

    removeOnlineUser(userName){
      this.onlineUsers = this.onlineUsers.filter((user)=>{
        return user.userName!=userName;
      });
    }
  }

  const [chatBoxx, setChatBoxx] = useState(new ChatBox());
  const [_, forceRender] = useReducer((x) => !x, false);
  const [hasjoined, setHasJoined] = useState(false);

  const modifyChatBox = (chatObj) => {
    setChatBoxx(chatObj);
    console.log("modifyChat function called");
    console.log(chatBoxx);
    forceRender();
  };

  if (!hasjoined && auth.userName) {
    console.log("sending join request");
    socket.emit("joined", {
      userName: auth.userName,
    });
    setHasJoined(true);
  }

  const context = {
    chatBox: chatBoxx,
    setChatBox: modifyChatBox,
  };
  return (
    <ChatContext.Provider value={context}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
