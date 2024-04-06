/** @format */

const UrlShrotner = require("../models/main");

const createId = async (req, res) => {
  try {
    const url = req.body.url;
    console.log(req.body);
    const newUrlShortner = new UrlShrotner({
      url,
    });

    await newUrlShortner.save();

    res.status(200).json({ message: "url saved",id: newUrlShortner.id });
  } catch (err) {

    res.status(500).json({err : "url not saved, error occured"});
  }
};

const getOriginalUrl = async (req,res)=>{

    
}

exports.createId = createId;

