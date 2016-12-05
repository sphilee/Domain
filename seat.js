var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seatSchema = new Schema({
  seat: Number,
  start: String,
  end: String,
  data: Object,
});
module.exports = mongoose.model('seat', seatSchema);
