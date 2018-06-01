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
var server = app.listen(port); // 监听 port[3000]端口
console.log('node_server start on port' + port);

var io = require('socket.io')(server);

var users = {}
var Message = require('./models/message.js')
var HomeWork = require('./models/homework.js')

io.on('connection', function (socket) {
    console.log("有用户连接")
    //监听用户发布聊天内容
    socket.on('message', function (obj) {
        //向所有客户端广播发布的消息
        console.log(obj)
        io.emit('message', obj)
        var mess = {
            username: obj.username,
            msg: obj.msg,
            name: obj.name
        }
        var message = new Message(mess)
        message.save(function (err, mess) {
            if (err) {
                console.log(err)
            }
            console.log(mess)
        })
        console.log(obj.name + '说：' + obj.msg)
    })

    socket.on('homework', function(obj){
        var mess = {
            creatUser: obj.user,
            title: obj.title,
            content: obj.content,
            class: obj.class
        }
        var homework = new HomeWork(mess);
        homework.save(function(err, mess){
            if(err){
                console.log(err)
            }
            console.log('增加问题成功',mess);
        })
    })

    socket.on('disconnect', function () {
        delete users[socket.name]
        //用户监听用退出聊天室
        io.emit('logout', users)
    })
})





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
                res.json({'state':'success','name':doc.name});
              //  res.end("success");
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

