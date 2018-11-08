const mongoose = require("mongoose");
const database = require("../database");

let creditSchema = new mongoose.Schema({
  location: {
    type: String,
    default: "Default"
  },
  amount: Number,
  status: {
    type: String,
    enum: ["PENDING", "ERROR", "OK", "TIMEOUT"]
  }
});

module.exports = dbKey => database.get(dbKey).model("Credit", creditSchema);
