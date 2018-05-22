// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const fs = require('fs');
//跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    // if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    // else 
    next();
});
// view engine setup
app.use(express.static('./'));
app.use(express.static(__dirname + './data'));
app.use(express.static(__dirname + './data/HLS-demo-master'));
console.log(__dirname);
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


var mongoose = require('mongoose'); // 加载mongoose模块
mongoose.connect('mongodb://localhost:27017/user', function (err) {
    if (err) {
        // 连接mongodb本地数据库imovie
        console.log('MongoDB connection failed!')
    } else {
        // 连接mongodb本地数据库imovie
        console.log('MongoDB connection success!');
    }
});  

var port = process.env.PORT || 5200; // 设置端口号：3000
app.listen(port); // 监听 port[3000]端口
console.log('node_server start on port' + port);

const user = require('./models/user.js'); // 载入mongoose编译后的模型user
const control = require('./models/control.js');// 载入mongoose编译后的模型user

app.post('/login', function (req, res) {
    console.log(req.query);
    user.findOne({account: req.query.account},function (err,doc) {
        console.log(doc);
        if(err || doc==null){
           console.log(err);
           res.end("failed");
        }else{
            if (req.query.pwd == doc.pw) {
                console.log("密码正确");
                res.end("success");
            } else {
                console.log("密码错误");
                res.end("failed");
            }
        }
    })
});

app.get('/control',function (req,res) {
    console.log(req);
    control.findOne({index: 1},function (err,doc) {
        console.log(doc)
        res.json(doc);
        res.end();
    })
})

//修改亮度
app.post('/control/light',function (req,res) {
    console.log(req.param);
    control.update({index: 1},{"light.light_control": req.query.light_control},function (err,raw) {
        res.end('success');
    })
})

//修改温度
app.post('/control/temp', function (req, res) {
    console.log(req.param);
    control.update({ index: 1 }, { "temp.temp_control": req.query.temp_control }, function (err, raw) {
        res.end('success');
    })
})

//个人信息页面
app.get('/personal',function (req,res) {
    user.findOne({account: req.query.account},function (err,doc) {
        res.json(doc);
        res.end();
    })
})

/* //个人信息修改
app.post('/personal/update',function (req,res) {
    
})
 */
app.post('/download',function (req,res,next) {
    console.log("download")
    var currFile = path.join('./data', 'gaoshu.ppt'),
    fReadStream;

    fs.exists(currFile, function (exist) {
        if (exist) {
            res.set({
                "Content-type": "application/octet-stream",
                "Content-Disposition": "attachment;filename=" + encodeURI("gaoshu.ppt")
            });
            fReadStream = fs.createReadStream(currFile);
            fReadStream.on("data", (chunk) => res.write(chunk, "binary"));
            fReadStream.on("end", function () {
                res.end();
            });
        } else {
            res.set("Content-type", "text/html");
            res.send("file not exist!");
            res.end();
        }
    });
})
app.get('/', function (req,res) {
    console.log("/////////////////");
    res.end("success");
})

