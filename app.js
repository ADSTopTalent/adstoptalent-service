var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const Grid = require('gridfs-stream');
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
 		/*email: String,
    name : String,
    password : String,
    address : String */
    firstname: String,
    lastname: String,
    emailId: String,
    newToken:String
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

	app.post('/attendence',function(req,res,next){
    	var result=req.body;
    	console.log(req.body);
    	if(result!=null){
    		res.json({result:success});
    	}
    	else{
    		res.json("error");
    	}
	});


	app.post('/register', function(req, res, next) {
  		/* var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;*/
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

    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="dev.adstoptalent.com/verify?id="+newToken;

    var mailOptions = {
      from: 'sanjeevkaushik1195@gmail.com',
      to: req.body.emailId,
      subject: 'Sending Email using Node.js',
      html: "<a href="+link+">Open Link to Verify</a>"
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
   		/*var qr_svg = qr.image(data, { type: 'png' });
   		var img_name = qr_svg.pipe(require('fs').createWriteStream('./public/'+user._id+'.png'));
      */
	});

  app.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))  {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand) {   
            res.sendRedirect('http:192.168.0.172:5000');
            res.end();
        }
        else{
            console.log("email is not verified");
            res.send({"status":false});
        }
    }
    else{
        res.end("<h1>Request is from unknown source");
    }
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

module.exports = app;
