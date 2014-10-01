
/*
 * Profile
 */

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
   connection = require('../db.js').handleDisconnect();
   callback(connection);
 };
 usingItNow(myCallback);

var nodemailer = require("nodemailer");
var fs = require('fs-then');
exports.list = function(req, res) {
  res.render('profile' , { title: 'Express' });
};


  exports.index = function(req, res) {
    // call Fn for db query with callback
    all_users_data(function(err,data){
    if (err) {
      // error handling code goes here
      console.log("ERROR : ",err);            
    } else {            
      // code to execute on data retrieval
      console.log("result from db is : ",data); 
      if(typeof req.user == 'undefined') {
        console.log("User Not Found");
        res.render('index',{ alllots: data });
      }else {
        var fbid = req.user.id;
        var username = req.user.username;
        if(typeof username == 'undefined'){
          email = req.user.emails[0].value;
          find_user = email.split("@");
          username = find_user[0];
        }
     
        var full_name = req.user.displayName;
        var query = 'SELECT * FROM users WHERE fbid = "'+fbid+'"';
        connection.query(query, function(err , rows , fields)  {
        if (err) throw err;
          console.log('the rows are:', rows.length);
        if(rows.length == 1)  {
          console.log("Hello data" ,data);
          res.render('index', { alllots : data, user: rows[0]});
        } else if(rows.length == 0)  {
          var image = "https://graph.facebook.com/"+req.user.id+"/picture?type=normal";
          connection.query('INSERT INTO users (fbid, username, image, full_name,displayName) VALUES (? , ? , ? , ?, ?);', [fbid, username , image, full_name , full_name], function(err, docs) {
            console.log(err);
            if (err) res.json(err);

              console.log("Hello" ,req.user);
            var mailbody = "Hi <p><b>"+ req.user.displayName+",</b></p> and participating in these Junkstr and I write to welcome you to our service. From now you can interact with others in Junkstr and also now have your own virtual garage where you can show your friends and the world all that you offer. If you have something you can advertise for free, simple and fast Junkstr.<br/>regards,<br/>The team Junkstr";
             sendEmailToUser(mailbody, req.user.emails[0].value);
              res.render('index', { alllots: data, img: image, user: req.user});
            });
          }
        });
      }
     }    

    });

  };

  exports.user_products = function(req,res){
    console.log("fb id", req.user);
    if(req.user.id != '' && typeof req.user.id != 'undefined') {
    
    connection.query('SELECT * FROM products WHERE uid = "'+req.user.id+'"' , function(err , rows){
        if (err) res.json(err);
        connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"' , function(err , user) {
               if (err) throw err;
               console.log("rows",rows);
               var profile_pic = user[0].image;
               console.log("profile_pic",profile_pic);
               res.render('migarage', { user_data : rows , user: user[0] , img : profile_pic, name: user[0].full_name });
          });
        });
      }
    };

  function all_users_data(callback) {
    console.log("asdasdada", callback);
    connection.query('SELECT users.username, users.full_name, users.image, products.price, products.pid, products.pimage, products.top_position,products.singal_imgs, products.left_position, products.Location FROM products INNER JOIN users ON users.fbid = products.uid', function(err , lotrows) {
      if (err) 
        callback(err,null);
      else
        callback(null,lotrows);
    });
  }


function sendEmailToUser(message, to) {
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("Direct", {debug: true});

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "<no-responder@.addelmind.com>", // sender address
        to: to, // list of receivers
        subject: "Welcome to Add el Mind", // Subject line
        text: "Welcome to Add el Mind", // plaintext body
        html: message, // html body
        generateTextFromHTML: true
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

}
