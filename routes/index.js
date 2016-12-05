const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
var path = require('path');
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
router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
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
