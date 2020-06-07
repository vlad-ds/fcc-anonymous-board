const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('error', err => {
  console.log(err);
});

const threadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: Array
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;