
/*
 * Posts
 */
var fs = require('fs-then');
var nodemailer = require("nodemailer");
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


exports.list = function(req, res){
    connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"' , function(err , user) {
       if (err) res.json(err);
       res.render('post', {user: user[0], img1 : user[0].image });
    });
};

exports.createlot = function(req, res) {
 if(typeof req.body.full_description == 'undefined') {
       descri = "";
    }else  {
       descri = req.body.full_description;
    }
    var desc   = descri,
        location = req.body.full_location,
        price  = req.body.full_price,
        user = req.user.id,
        pimage = '',
        title = '',
        category = JSON.stringify(req.body.category),
        image = req.body.image,
        single_imgs_prices = req.body.prices;
         console.log("single_imgs_prices",single_imgs_prices);
        var data = image.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        var date = new Date();
        var dateObject = new Date();
        var uniqueId =
          user + '' +
          dateObject.getFullYear() + '' +
          dateObject.getMonth() + '' +
          dateObject.getDate() + '' +
          dateObject.getTime();
        var leftval = req.body.left;
        var topval = req.body.top;
        tag_title = req.body.title;
        tag_dec = req.body.dec;
        fs.writeFile("./public/product_images/"+uniqueId+".jpg", buf);
        pimage = uniqueId + '.jpg';

        var timg;
        if( req.body.taggedImages == 'no value') {
            timg= " ";
          }else {
            var count_iner = req.body.taggedImages.length;
            var int_count = 0;
            var taggedmg,taggedmgi,taggedmgia;
        var uniqueId =
          req.body.user[0] + '' +
          dateObject.getFullYear() + '' +
          dateObject.getMonth() + '' +
          dateObject.getDate() + '' +
          dateObject.getTime();
        console.log("Dinesh......0",req.body.taggedImages );
            for( int_count = 0 ; int_count < count_iner; int_count++ )
              {
                var innerimge = req.body.taggedImages[int_count];
                var data1 = innerimge.replace(/^data:image\/\w+;base64,/, "");
                var buf1 = new Buffer(data1, 'base64');
                fs.writeFile("./public/product_images/"+uniqueId+int_count+".jpg", buf1);
                taggedmg = uniqueId+int_count+'.jpg';
                taggedmgi = taggedmgi+','+taggedmg;
              }
              taggedmgia = taggedmgi.split("undefined,");
              timg = taggedmgia[1];
          }
      var pdate = new Date();


    connection.query('INSERT INTO products (pid, price, Description, Location , tittle, uid, pimage, left_position , top_position , tag_title , tag_dec ,  categories , singal_imgs , single_imgs_prices , pdate ) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? );', ['', price, desc, location, title, user, pimage, leftval, topval, tag_title, tag_dec, category , timg , single_imgs_prices, pdate ], function(err, result) {
       if (err) res.json(err);
       console.log("Error", err);
       res.send('User added to database with ID');
       console.log("yes");
       // also insert data in subproducts table
       if(req.body.taggedImages != 'no value') { 
        var count = 0;
        product_img = timg.split(',');
        tag_title = tag_title.split(',');
        tag_desc = tag_dec.split(',');
        left_position = leftval.split(',');
        top_position = topval.split(',');
        product_prices = single_imgs_prices.split(',');
        user = req.user.id;
        product_table_id = result.insertId;
        location = req.body.full_location;

        for(var ix= 0; ix < product_img.length; ix++){
          insertDataSubproducts(user,product_img[ix],tag_title[ix], tag_desc[ix],category, left_position[ix],top_position[ix], product_prices[ix],pdate, product_table_id , location, function(err, data) {
            console.log('Conversations', data);
         });

          // connection.query('INSERT INTO subproducts (id, fbid, left_position , top_position , tag_title , tag_dec ,  categories , product_img , product_prices , pdate ) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? );', ['', user, left_position[0], top_position[0], tag_title[0], tag_desc[0], category , product_img[0] , product_prices[0], pdate ], function(err, result) {
          //    if (err) res.json(err);
          //    console.log("Error", err);
          //    res.send('subproduct added to database with uid');
          //    count++;
          //     if (count == product_img.length) {
          //         console.log('inserted will end now!!!');
          //         connection.end();
          //     }
          //  });
        
        }
      }



     });


};


exports.done = function(req, res) {
  console.log("session_id", req.user.id);
    connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"', function(err, result) {
     if (err) res.json(err);
     console.log("Error", err);
     res.render('final', { user: result[0] });
   });

};

exports.showLot = function(req, res) {
    connection.query('SELECT users.username, users.full_name, users.image, products.* FROM products INNER JOIN users ON users.fbid = products.uid and pid = "'+req.params.lot_id+'"' , function(err , lot){
        if (err) res.json(err);

      connection.query('SELECT * FROM subproducts where pid = "'+req.params.lot_id+'"' , function(err , data){
        if (err) res.json(err);
        console.log("data lot", lot);
          if(typeof req.user != 'undefined') {  
            connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"' , function(err , user) {
               if (err) res.json(err);
               res.render('lot', {user: user[0], lot: lot, subdata: data });
            });
          } else {
            res.render('lot', { lot: lot , subdata: data });
          }
      });
    });
};

exports.LotByCategory = function(req, res) {
    connection.query('select users.username, users.full_name, users.image, products.price, products.pid, products.pimage, products.Location from products INNER JOIN users on users.fbid = products.uid where categories like "%'+ req.params.cate_id +'%"' , function(err , categories) {
         if (err) throw err;
         console.log("categories", categories);
         res.render('explorelots' , { category: categories , category1 : req.params.cate_id });
  });
};

exports.searchProducts = function (req, res) {
     connection.query('SELECT users.username, users.full_name, users.image, products.* FROM products INNER JOIN users ON users.fbid = products.uid  where tag_title like "%'+ req.query.q +'%"' , function(err , products){
      if (err) res.json(err);
      if(typeof req.user != 'undefined') {  
        connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"' , function(err , user) {
               if (err) res.json(err);
               console.log("products", products);
               res.render('productsearch', { search_products: products ,user: user[0], message: req.query.q});
        });
      } else {
        console.log("products", products);
        res.render('productsearch', { search_products: products,  message: req.query.q});
      }
  });

}

exports.buyPage = function (req, res) {
  console.log("bupage", req.params.buy_id);
 connection.query('SELECT users.username, users.full_name, users.image, subproducts.* FROM  subproducts INNER JOIN users ON users.fbid = subproducts.fbid where subproducts.id = "'+ req.params.buy_id +'"' , function(err , subproducts){
    if (err) res.json(err); 
    console.log("subproducts", subproducts);
      connection.query('SELECT * FROM subproducts where pid = "'+subproducts[0].pid+'"' , function(err , data){
        if (err) res.json(err);
        console.log("data data", data);
          if(typeof req.user != 'undefined') {  
            connection.query('SELECT *FROM users WHERE fbid = "'+ req.user.id +'"' , function(err , user) {
               if (err) res.json(err);
               res.render('buy', {products: subproducts, user: user[0],  subdata: data });
            });
          } else {
            res.render('buy', { products: subproducts , subdata: data });
          }
      });

  });
}


exports.reservepage = function (req,res) {
      connection.query('SELECT users.username, users.full_name, users.image, products.*  FROM  products INNER JOIN users ON users.fbid = products.uid where products.pid  = "'+ req.query.id +'"' , function(err , products){ 
           fs.readFile('./views/email.html', function (err, data) {
            if (err) {
                throw err;
            }else{
                var buff = new Buffer(data, 'utf8'); //no sure about this
                 var html = buff.toString(); 
                console.log("productsproducts", products);
           var Emailtemplate = '<html xmlns="http://www.w3.org/1999/xhtml">'+
                '<head>'+
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
                '<title>::All-El-Mind::</title>'+
                '</head>'+
                '<body style="margin:0;  font-size:14px; font-family:Georgia, Times, serif; padding:0;">'+
                '<div style="margin:0 auto; width:540px; ">'+
                '<table  cellpadding="0" cellspacing="0" style=" font-size:12px; background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #DDDDDD; box-shadow:0 0 5px 0 #DDDDDD; -ms-box-shadow:0 0 5px 0 #DDDDDD; -webkit-box-shadow:0 0 5px 0 #DDDDDD; margin-top:10px; background:#fff; padding:15px 25px;  text-align:center;'+
                  '<tr>'+
                      '<td style="border-bottom:1px solid #ddd; padding-bottom:10px;"> <img src="logo.png" /></td>'+
                    '</tr>'+
                    '<tr>'+
                       '<td>'+
                          '<img style="margin-top:10px; max-width:100%;  " src="http://mastersoftwaretechnologies.com:4004/public/product_images/'+ products[0].pimage +'".png" />'+
                        '</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td style="text-align:left; height:250px; vertical-align:top;">'+
                        '<p style="color:#282828; text-align:left; font-weight:bold; margin-top:30px; margin-bottom:20px;">'+
                            'Hi '+ products[0].full_name +','+ 
                              
                           '<p style="color:#2c2c2c; text-align:left; line-height:20px; margin-bottom:20px;">and participating in these addelmind and I write to welcome you to our service.'+
              '<br /><br />'+
              'From now you can interact with others in addelmind and also now have your own virtual garage where you can show your friends and the world all that you offer.'+
              '<br /><br />'+
              'If you have something you can advertise for free, simple and fast addelmind.'+
              '</p>'+
                           
                          '<p style="color:#2c2c2c; text-align:left; margin-top:60px; margin-bottom:20px;">'+
                            'Regards,'+
                    '</p> '+  
                        '<p style="font-size:14px; line-height:19px; color:#282828;"> '+
                           
              'The team addelmind'+
                          '</p>'+   
                      '</td>'+
                  '</tr>'+
                  '<tr>'+
                   '<td style="padding-bottom:40px;"> </td>'+              
                   '</tr>'+
                  '<tr>'+
                    '<td style="padding-bottom:40px;"> </td>'+
                  '</tr>'+
                '</table>'+
                '</div>'+
                '</body>'+
                '</html>';


                 sendProductEmailToUser(Emailtemplate, req.user.emails[0].value);
                res.render('confirmation', { 
                  pdata: products,
                  user: products[0],
                });
             }
            
          });
       });
}

function insertDataSubproducts(user,pimg, title, desc,cate,left,top,prices, pdate,product_table_id,location, callback) {
    connection.query('INSERT INTO subproducts (id, fbid, pid, location, left_position , top_position , tag_title , tag_dec ,  categories , product_img , product_prices , pdate ) VALUES (? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? );', ['', user, product_table_id, location, left, top, title, desc, cate, pimg , prices, pdate ], function(err, results) {
      if (err) 
        callback(err,null);
      else
        callback(null,results);
    });
}



function sendProductEmailToUser(message, to) {
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("Direct", {debug: true});

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "<no-responder@addelmind.com>", // sender address
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
