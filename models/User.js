const mongoose = require("mongoose");

const DCUser = mongoose.Schema({
   username: {
    type: String,
    required: true
   },
   servername: {
    type: String,
    required: true
   }
});

module.exports = mongoose.model('Userdata', DCUser);