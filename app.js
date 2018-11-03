var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const Grid = require('gridfs-stream');
const port = 3000;
var logger = require('morgan');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var qr = require('qr-image');
var fs=require('fs');
var mysql = require('mysql');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Employee");

	var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
    res.header('Access-Control-Max-Age', 1728000);
   	res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Content-Length', 0);
      
    if ('OPTIONS' == req.method) {
     	res.send(200);
    }
    else {
    	next();
  	}
	};

  app.use(allowCrossDomain);  
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.disable('etag');

	var UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    emailId: String,
    newToken:String,
    password:String,
    address1:String,
    address2:String,
    city:String,
    state:String,
    zip:String,
    country:String
	});
	var User = mongoose.model('User', UserSchema);
	module.export = User;

	app.post('/login', function(req, res) {
    console.log('Req body in login ', req.body)
    var email = req.body.email;
    var password = req.body.password;
    var cursor = User.find();
  	User.findOne({email:email,password:password}, function(err, isMatch) {
      console.log('ISMATCH IS: ' + isMatch)
    	if(err) {
        console.log('THIS IS ERROR RESPONSE')
      	res.json(err)
      } else {
          console.log('THIS IS ISMATCH RESPONSE');
      		res.json(isMatch);
        }
    })
  })

	app.post('/registerfinal',function(req,res,next){
  	var emailId=req.body.emailId;
    var password=req.body.password;
    var address1=req.body.address1;
    var address2=req.body.address2;
    var city=req.body.city;
    var state=req.body.state;
    var zip=req.body.zip;
    var country=req.body.country;
    console.log(req.body);
    console.log(emailId);
    User.updateOne({emailId:emailId}, { $set: {password:password, address1:address1,address2:address2,city:city,state:state,zip:zip,country:country } },{upsert:false,multi:true}, function(err, isMatch) {
      if (err) throw err;
      res.json(isMatch);
    });
	});


	app.post('/register', function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var emailId = req.body.emailId;
		var imgPath = './public';
		console.log(req.body);

    var newToken = jwt.sign({
      data: 'user'
    }, 'secret', { expiresIn: '1h' });
    console.log(newToken);
    console.log(req.body);

		var user = new User({
  		firstname : firstname ,
      lastname : lastname ,
      emailId : emailId ,
      newToken:newToken
    });
    
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      service: 'gmail',
      auth: {
         user: 'sanjeevkaushik1195@gmail.com',
        pass: 'lovingdad@143()'
      }
    });

    link="http://192.168.0.172:5000/verify/"+newToken;

    var mailOptions = {
      from: 'sanjeevkaushik1195@gmail.com',
      to: req.body.emailId,
      subject: 'Sending Email using Node.js',
      html:'<p>Thanks for registering with us!Please verify using below link</p><a href='+link+'>'+link+'</a>'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
   
    user.save(user, function(err, isMatch) {
      console.log('ISMATCH IS: ' + isMatch)
      if(err) {
        console.log('THIS IS ERROR RESPONSE')
        res.json({"status": false})
      } else {
          console.log('THIS IS ISMATCH RESPONSE')
          res.json({"status": true})  
      }
    })
	});

  app.post('/verify',function(req,res){
    var newToken = req.body.token;
    User.findOne({newToken:newToken}, function(err, isMatch) {
      console.log('ISMATCH IS: ' + isMatch)
      if(err) {
        console.log('THIS IS ERROR RESPONSE')
        res.json(err)
      } else {
          console.log('THIS IS ISMATCH RESPONSE');
          res.json(isMatch);
        }
    })
  });

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port);
module.exports = app;
