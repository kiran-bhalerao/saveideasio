const mongoose = require('mongoose');

module.exports = (app, PORT) => {
    console.log('starting Server ..');
    mongoose.connect('mongodb://kiranbhalerao123:kiran123@ds225382.mlab.com:25382/demo-project', { useNewUrlParser: true })
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server Started at ${PORT}`);
            });
        })
        .catch((err) => {
            console.log('Cannt start server cause :) mongoose has ' + err.message);
        });
};