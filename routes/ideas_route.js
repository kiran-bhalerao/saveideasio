const ensureAuthen = require('../config/auth');
const Idea = require('../models/Idea');

module.exports = (appRouter) => {

    appRouter.route('/ideas/add').get(ensureAuthen, (req, res) => {
        res.render('ideas/add');
    });

    appRouter.route('/ideas/edit/:id').get(ensureAuthen, (req, res) => {
        Idea.findById(req.params.id).then((idea) => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            }
            else
                res.render('ideas/edit', idea)
        });
    });

    appRouter.route('/ideas/:id')
        .put(ensureAuthen, (req, res) => {
            Idea.findOneAndUpdate({ _id: req.params.id }, {
                title: req.body.title,
                details: req.body.details
            }).then(() => {
                req.flash('success_msg', `${req.body.title} is updated !`);
                res.redirect('/ideas');
            });
        })
        .delete(ensureAuthen, (req, res) => {
            Idea.findOneAndDelete({ _id: req.params.id })
                .then(() => {
                    req.flash('success_msg', `Idea is deleted !`)
                    res.redirect('/ideas');
                });
        });


    appRouter.route('/ideas')
        .post(ensureAuthen, (req, res) => {
            let errors = [];
            if (!req.body.title)
                errors.push({ text: 'Please enter Title' });
            if (!req.body.details)
                errors.push({ text: 'Please enter Details' });
            if (errors.length > 0) {
                res.render('ideas/add', {
                    errors: errors,
                    title: req.body.title,
                    details: req.body.details
                });
            } else {
                const newUser = {
                    title: req.body.title,
                    details: req.body.details,
                    user: req.user.id
                }
                new Idea(newUser).save().then((idea) => {
                    req.flash('success_msg', `Idea is saved !`)
                    res.redirect('ideas');
                });
            }
        })
        .get(ensureAuthen, (req, res) => {
            Idea.find({ user: req.user.id }).sort({ Date: 1 }).then((ideas) => {
                res.render('ideas/index', { ideas });
            });
        });
};