const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

module.exports = (appRouter) => {
    appRouter.route('/')
        .get((req, res) => {
            res.render('index', {
                text: 'welcome to SaveIdeas.io'
            });
        });

    appRouter.route('/user/login')
        .get((req, res) => {
            res.render('user/login');
        })
        .post((req, res, next) => {
            passport.authenticate('local', {
                successRedirect: '/ideas',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next);
        });

    appRouter.route('/user/logout').get((req, res) => {
        req.logout();
        req.flash('success_msg', 'Logout successfuly.');
        res.redirect('/user/login');
    });


    appRouter.route('/user/register')
        .get((req, res) => {
            res.render('user/register');
        })
        .post((req, res) => {
            let errors = [];
            if (req.body.password !== req.body.cpassword) {
                errors.push({ text: "Make sure your Passwords are same !" });
            }
            if (errors.length > 0) {
                res.render('user/register', {
                    errors: errors,
                    name: req.body.name,
                    email: req.body.email
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        }).save()
                            .then(() => {
                                req.flash('success_msg', 'You are register successfuly.');
                                res.render('user/login', {
                                    email: req.body.email
                                });
                            }).catch((err) => {
                                if (err.message.includes('duplicate key')) {
                                    req.flash('error_msg', 'Email already exist.');
                                    res.redirect('register');
                                } else {
                                    req.flash('error_msg', 'Unknown error occured.');
                                    res.redirect('register');
                                }
                            });
                    });
                });
            }
        });

    appRouter.route('/about')
        .get((req, res) => {
            res.render('about');
        });
};