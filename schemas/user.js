var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    index: Number,
    role: String,
    school: String,
    class: String,
    account: Number,
    name: String,
    pw: String,
    phone: String,
    sex: String,
    introduce: String,
    question: String,
    poster: String,
    year: Number,
    // meta 更新或录入数据的时间记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        },
    }
});

// movieSchema.pre 表示每次存储数据之前都先调用这个方法
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// userSchema 模式的静态方法
userSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

// 导出userSchema模式
module.exports = userSchema;

