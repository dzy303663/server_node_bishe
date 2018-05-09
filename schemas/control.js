var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var controlSchema = new Schema({
    temp: {
        temp_now: Number,
        temp_control: Number
    },
    light: {
        light_now: Number,
        light_control: Number
    },
    atmosphere: {
        so2: Number,
        co: Number,
        no2: Number,
        pm2: Number,
        pm10: Number,
        aqi: Number
    },
    curtain: {
        one: String,
        two: String,
        three: String
    },
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
})

// movieSchema.pre 表示每次存储数据之前都先调用这个方法
controlSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

module.exports = controlSchema