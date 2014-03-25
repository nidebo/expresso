
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var util = require('util');

var Controller = require('./server/Controller');

var users = [
    { id: 1, username: 'bob', password: '222' },
    { id: 2, username: 'pep', password: '333' }
];

var findById = function (id, fn) {
    var idx = id - 1;
    if(users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
};

var findByUsername = function(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
            findByUsername(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, { message: 'Unknown user: ' + username });
                if (user.password != password)
                    return done(null, false, { message: 'Invalid password' });
                return done(null, user);
            });
        });
    }
));


var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'muchacho longo' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

var controller = new Controller();

////////////////////////////
app.get('/', ensureAuthenticated, controller.index);
app.get('/login', controller.getLogin);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login'}),
  function(req, res) {
    console.log(req.user.username + ' has logged in');
    res.redirect('/');
  });
app.get('/logout', controller.logout);
app.get('/precio', ensureAuthenticated, controller.precio);
app.post('/new', controller.newUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}