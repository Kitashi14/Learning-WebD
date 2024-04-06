// import {mongoose} from "mongoose";
const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
    url : {
        type: String,
        require: true,
        
    },
});

module.exports= mongoose.model("UrlShrotner", urlSchema);