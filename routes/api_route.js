const User = require('../models/User');
module.exports = (appRouter) => {
    appRouter.route('/api/users').get((req, res) => {
        User.find({}, { _id: 0, email: 1, name: 1 }).then((users) => {
            res.send(users);
        });
    });
};