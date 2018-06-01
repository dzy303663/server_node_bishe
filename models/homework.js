var mongoose = require("mongoose");
var controlSchema = require("../schemas/homework");

var homework = mongoose.model('homework',homeworkSchema);

module.exports = homework;