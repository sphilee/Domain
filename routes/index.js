const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
var db = require('../db.js');
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
router.get('/', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register',{});
});
router.get('/GetSeat', (req, res) => {
    res.render('GetSeat'),{user: req.user};
});
router.get('/map', (req,res) => {
    res.render('map',{user: req.user});
});
router.post('/map',(req,res) => {
    var floor = req.body.floor;
    var personalData = {floor:floor};
    var newData = {query,personalData};
    var query = {'username':req.user.username};
	Account.findOneAndUpdate(query,newData,{upsert:true}, function(err,docs){
        res.render("map",{user:docs});   
	console.log(docs);
	});
});
router.get('/assign',(req,res) => {
    res.render('assign',{user: req.user});
});
router.get('/mailbox', (req,res) => {
    res.render('mailbox',{user:req.user});
});
router.post('/mailbox', (req,res) => {
var transporter = nodemailer.createTransport('smtps://gwanhyung787%40gmail.com:gkawjd59@smtp.gmail.com');
    var mailOptions = {
	from : "gwanhyung787@gmail.com",
	to : req.body.email_to,
	subject : req.body.Type+req.body.Title,
	text : req.body.message
	};
transporter.sendMail(mailOptions, function (err, info) {
	if(err){
	return console.log(err);
	}
	else {
	console.log("Message sent: " + info.response);
	}
	transporter.close();
	});
    res.redirect('mailbox');
});
router.post('/GetSeat', (req,res) => {
	var start = req.body.start;
	var end = req.body.end;
	var seat = req.body.seat;
	var floor = req.user.personalData.floor;
	var query = {'username':req.user.username};
	var personalData = {start:start,end: end,seat: seat,floor:floor};
	var newData = {query,personalData};

	Account.findOneAndUpdate(query,newData,{upsert:true}, function(err,docs){
	res.render("GetSeat",{user:docs});
	console.log(docs);
	});
});
router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username,email:req.body.email }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', {error : err.message});
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/login');
            });
        });
    });
});


router.get('/login', (req, res) => {
   res.render('login',{user:req.user, error:req.flash('error')});
});
router.get('/index', (req, res ) => {
   user=req.user;
   res.render('index',{user:req.user});
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/index');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
