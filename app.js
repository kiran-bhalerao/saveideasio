const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const PORT = process.env.PORT || 6500;
const app = express();

// CONNECT TO MONGO
require('./config/mongoosConnect')(app, PORT);

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// BODY-PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// METHOD-OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'))

// SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// CONNECT-FLASH MIDDLEWARE
app.use(flash());

// GLOBEL VARIABLES
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
const appRouter = express.Router();
app.use('', appRouter);
require('./routes/users_route')(appRouter);
require('./routes/ideas_route')(appRouter);
require('./routes/api_route')(appRouter);

// PASSPORT CONFIG
require('./config/passport')(passport);




