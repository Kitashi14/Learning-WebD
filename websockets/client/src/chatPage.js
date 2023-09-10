/** @format */

import { useContext } from "react";
import AuthContext from "./context/authContext";
import { toast } from "react-toastify";

const ChatPage = () => {
  const auth = useContext(AuthContext);

  class User {
    constructor(otherParty) {
      this.userName = otherParty;
      this.latestMessage = false;
      this.messages = [];
    }

    getName() {
      return this.userName;
    }

    addMessage(data) {
      if (this.latestMessage < data.time || !this.latestMessage)
        this.latestMessage = data.time;
      this.messages.push(data);
    }

    async sendMessage(message) {
      var currTime = new Date();
      var stat = "Not Delivered";
      var from = auth.userName;
      var to = this.userName;
      this.latestMessage = currTime;

      try {
        //socket call
      } catch (err) {
        console.log(err);
        toast.error("Message can't be send.");
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

    async clientSaw() {
      var ids = this.messages.filter((data) => {
        return (
          data.to == auth.userName &&
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
      for (var j = 0; j < this.messages.length(); j++) {
        var id = this.messages[j].id;
        for (var i = 0; i < ids.length(); i++) {
          if (id == ids[i]) {
            this.messages[j].status = "seen";
          }
        }
      }
    }

    async clientReceived() {
      var ids = this.messages.filter((data) => {
        return data.to == auth.userName && data.status == "delivered";
      });

      try {
        //socket call
      } catch (err) {
        console.log(err);
      }
    }

    otheruserReceived(ids) {
      for (var j = 0; j < this.messages.length(); j++) {
        var id = this.messages[j].id;
        for (var i = 0; i < ids.length(); i++) {
          if (id == ids[i]) {
            this.messages[j].status = "received";
          }
        }
      }
    }
  }

  class ChatBox {
    constructor(data) {
      this.userIndex = new Map();
      this.users = [];
      data.map((row) => {
        var otherParty = row.from == auth.userName ? row.to : row.from;
        if (this.userIndex.has(otherParty)) {
          var i = this.userIndex.get(otherParty);
          this.users[i].addMessage(row);
        } else {
          const user = new User(otherParty);
          user.addMessage(row);
          this.users.push(user);
          this.userIndex.set(otherParty, this.users.length() - 1);
        }
      });

      this.users.sort((a, b) => {
        return b.latestMessage - a.latestMessage;
      });
      for (var i = 0; i < this.users.length(); i++) {
        this.userIndex.set(this.users[i].getName(), i);
        this.users[i].clientReceived();
      }
    }

    async send(name, message) {
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length() - 1;
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(message);
        this.users[0] = temp;
        this.userIndex.set(name,0);
      } else {
        var idx = this.userIndex.get(name);
        var temp = this.users[idx];
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(message);
        this.users[0] = temp;
        this.userIndex.set(this.users[0].getName(), 0);
      }
    }

    recieve(data) {
      var name = data.from;
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length() - 1;
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

      if (userFound.length() > 0) return true;
      return false;
    }
  }
  return <></>;
};

export default ChatPage;
