/** @format */

//extracting router method from express module
const express = require("express");
const router = express.Router();

const urlShrotnerApis = require("../controllers/urlShortner");

router.post("/createShortUrl", urlShrotnerApis.createId);

module.exports = router;
