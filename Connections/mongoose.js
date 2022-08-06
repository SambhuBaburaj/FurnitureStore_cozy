const mongoose = require("mongoose");

const { stringify } = require("uuid");

require("dotenv").config();
const url = process.env.URL;
mongoose.connect(url).then(() => {
    console.log("connection success");
  })
  .catch((err) => console.log(err));
 