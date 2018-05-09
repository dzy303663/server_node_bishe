var mongoose = require('mongoose');
var userSchema = require('../schemas/user.js'); //引入'../schemas/user.js'导出的模式模块

// 编译生成user模型
var user = mongoose.model('user', userSchema);

// 将user模型[构造函数]导出
module.exports = user;