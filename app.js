var express = require('express')
  , formidable = require('formidable')
  , http = require('http')
  , passport = require('passport')
  , util = require('util')
  , mysql = require('mysql')
  , nodemailer = require("nodemailer")
  , fs = require('fs-then')
  , crypto = require('crypto')
  , routes = require('./routes')
  , posts = require('./routes/post')
  , profile = require('./routes/profile')
  , FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = "492888680815744"
var FACEBOOK_APP_SECRET = "5b170365d3ca6914ff26b38978f35d3b";
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://addelmind-app.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.set('port', process.env.PORT || 4004);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var connection;
// callback
 var myCallback = function(connection) {
   connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    else {
      console.log("Connected To DB !!!");
    }
  });
   connection.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('daily enter');
      usingItNow(myCallback);
    } else {
      throw err;
    }
  });
 };
 var usingItNow = function(callback) {
   connection = require('./db.js').handleDisconnect();
   callback(connection);
 };
 usingItNow(myCallback);

app.get('/' , profile.index);

app.get('/profile/settings', function(req,res){
  username = req.user.id;
  var query = 'SELECT * FROM users WHERE fbid = "'+username+'"';
  connection.query(query, function(err , rows , fields)
  {
    if (err) throw err;
    console.log('the rows are:', rows);
    res.render('profile' , { user: rows[0] });
  });
});

/* Include user_products here */

app.get('/user/:id', ensureAuthenticated , profile.user_products);
app.get('/publish', ensureAuthenticated , posts.list);
app.get('/publish-done', posts.done);
app.post('/api/createlot', posts.createlot);
app.get('/lot/:lot_id', posts.showLot);
app.get('/explore/:cate_id' , posts.LotByCategory);
app.get('/search/items/' , posts.searchProducts);
app.get('/item/:buy_id', posts.buyPage)
app.get('/reserve/', posts.reservepage);



app.post('/upload/image', function(req, resp) {
  id = req.user.id;
  crypto.randomBytes(8, function(ex, buf) {

  var array     = req.files.key.name.split('.');
  var type      = array[array.length - 1];
  var name      = buf.toString('hex') + '.' + type;
  image = '/uploads/' + name;
  fs.rename(req.files.key.path, './public/uploads/' + name, function(e) {
  });
  connection.query('UPDATE users SET image = ? WHERE fbid = "'+id+'" ', [image], function(err, docs) {
    if (err)res.json(err);

    });
});
  var query = 'SELECT * FROM users WHERE fbid = "'+id+'"';
      connection.query(query, function(err , rows , fields)
  {
    if (err) throw err;
    resp.render('profile' , { user: rows[0] });
    resp.redirect('/profile/settings');
  });
});

app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope : "email"
  }),
  function(req, res){
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/upload', function(req, resp) {
  username = req.body.username;
  full_name = req.body.full_name;
  console.log('username', username , full_name);
  var id = req.user.id;
  connection.query('UPDATE users SET full_name = ?, username = ? WHERE fbid = "'+id+'" ', [full_name, username], function(err, docs) {
    if (err) res.json(err);
    });
  resp.redirect('/profile/settings');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


