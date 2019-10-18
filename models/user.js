const mongoose = require("mongoose");

// User schema and Model
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {                          // Username field
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  }

});



module.exports = mongoose.model("User", schema);
