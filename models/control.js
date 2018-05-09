var mongoose = require("mongoose");
var controlSchema = require("../schemas/control");

var control = mongoose.model('control',controlSchema);

module.exports = control;