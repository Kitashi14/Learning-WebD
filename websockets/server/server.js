/** @format */

// import express from "express";
// import { createServer } from "http";
// import { startSocket } from "./socket.js";
// import {mongoose} from "mongoose";
const express = require('express');
const {createServer}=require('http');
const {startSocket}=require('./socket');
const mongoose = require('mongoose');

const app = express();
const httpServer = createServer(app);

startSocket(httpServer);

mongoose
  .connect(`mongodb://localhost:27017/chat_app`)
  .then(() => {
    console.log("Connected to database\n");
  })
  .catch((err) => {
    console.log(err);
  });

httpServer.listen(3000, () => {
  console.log("server listening to port 3000....\n");
});
