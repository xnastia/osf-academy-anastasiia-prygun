// external imports
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

// custom imports
const cartLength = require('./middleware/cart');
const currency_exchange = require('./middleware/currency_exchange');
const secret = require('./config/secret');
const User = require('./models/user');
const Category = require('./models/category');

// get routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');
const wishesRoutes = require('./routes/wishes');
// initialize express
const app = express();

// connect node to mongodb
mongoose.connect(secret.database, (err) => {
    if (err) {
        console.log('Make sure the database server is running ' + err);
    } else {
        console.log('Connected to the database');
    }
}, {useNewUrlParser: true});

//middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true})
}));

app.use(flash());
// set the view
app.engine('ejs', engine);
app.set('view engine', 'ejs');
// make use of our passport module
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.user = req.user;
    if (res.locals.user && !req.session.currency) {
      req.session.currency = req.user.currency
    }
    next();
});
app.use(function(req, res, next){
    Category.find({}, function(err, categories){
      res.locals.categories = categories
      next();
    })
});
app.use(currency_exchange);
app.use(function(req, res, next){
   if (!req.session.currency || !global.rates[req.session.currency]) {
       req.session.currency = "USD"
   }
    res.locals.selected_currency = req.session.currency
    res.locals.exchange_rate = global.rates[req.session.currency]
    next()
});
app.use(cartLength);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(userRoutes);
app.use(wishesRoutes);
app.use(paymentRoutes);
app.listen(secret.port, (err) => {
    if (err) throw err;
    console.log('Go to http://localhost:' + secret.port + ' in your browser');
});