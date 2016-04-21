// server.js

    // set up ========================
  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var MongoClient = require('mongodb').MongoClient;
    var assert= require('assert');

    // configuration =================
           var url = 'mongodb://localhost:27017/atom';
        MongoClient.connect(url, function(err, db) {
          assert.equal(null, err);
          console.log("Connected correctly to atom server baby!.");
          db.close();
        });




   // mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({secret: 'ssshhhhh'}));

    
    // // define model =================
    // var Todo = mongoose.model('Todo', {
    //     rollNo : String,
    //     password : String
    // });



// routes ======================================================================
var name="";
    app.get('/home', function(req, res) {
        if (req.session.user_logged);
             res.sendfile("./home.html");
             else
                res.redirect('/login');
         });



    app.post('/login',function(req,res){
        MongoClient.connect(url,function(err,db){
            assert.equal(null, err);
            validateandenter(db, function(){
                db.close();
            });
        });


            var validateandenter= function(db,callback){
               db.collection("user").findOne({            
                                    "rollNo" : req.body.rollNo,
                                     "password" : req.body.password,},
                             function(err, data) {
                                                assert.equal(err, null);
                                                        if (data != null){
                                                                 if(data.password==req.body.password    ){
                                                                        callback();
                                                                        console.log("password matched!");
                                                                        req.session.user_logged=req.body.rollNo;
                                                                        name=req.session.user_logged;
                                                                        res.send("Oh you are right!");
                                                                    }
                                                                    else{
                                                                        callback();
                                                                        res.send("You try to fool me bastard!");
                                                                     }
                        
                                                        }  
                                                        
                                                        else
                                                        {
                                                            callback();
                                                            res.send("Invalid user");
                                                        }    


                   });

            }
         });
                                                
                                    
                                      
                                        

    app.get('/login', function(req, res) {
       if (!(req.session.user_logged))
             res.sendfile('./login.html');
         else
            res.redirect('/home');
            
       
    });

    // create todo and send back all todos after creation
    app.post('/register', function(req, res) {
               MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              checkpresenceandadd(db, function() {
                  db.close();
                 
          });
        });


        var checkpresenceandadd = function(db,callback){
            db.collection("user").findOne({"rollNo" : req.body.rollNo},function(err,doc){
                if(err)
                    return console.log(err);

                 if (doc != null){
                    callback();
                return res.send({"status":"Fucking user already exist",});}
           else
            {
                db.collection("user").insertOne({            
            "rollNo" : req.body.rollNo,
             "password" : req.body.password,},
             function(err, result) {
                                assert.equal(err, null);
                                console.log("Inserted a document into the User collection.");
                               
                                callback();
                                res.send("done");


                                });
              }  


            });
        }
           
                         
        
                 });  



       
 
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    
    // var checkpresenceandadd = function(db,callback){
    //         db.collection("user").findOne({"rollNo" : req.body.rollNo},function(err,doc){
    //             if(err)
    //                 return console.log(err);

    //              if (doc != null){
    //                 callback();
    //             return res.send({"status":"Fucking user already exist",});}
    //        else
    //         {
    //             db.collection("user").insertOne({            
    //         "rollNo" : req.body.rollNo,
    //          "password" : req.body.password,},
    //          function(err, res


    // socket programming
    
    var user = [];
    io.on('connection', function(socket){
        console.log("a user connected");

    name=req.session.user_logged;


//adding user to their respective channelor gropp;
  socket.on('add-user-to-group',function(username){
   // if (username!=null && username!=''){
        if(user.indexOf(username)==-1)
            {io.emit('messages',{user:username.username,msg:" joined"});
            name=username;
            user.push(name);
        }
        else
            socket.emit('tryagain');

        

    });
  
  //add user to private chat

  socket.on('add-user-to-private-chat',function(data){
   // if (username!=null && username!=''){
        var private_channel = name+'_'+data.touser;
        MongoClient.connect(url,function(err,db){
            assert.equal(null,err);

            function check_and_add_value_to_user_array(db,callback){
               



                db.collection('user').update({
                    rollNo:name,
                    //user: {$in : [data.touser]
                    }
                }
                {$addToSet: {
                    user:data.touser ;

                        }

                });

            }
            check_and_add_value_to_user_array(db,function(){
                console.log("user array successfully updated");
                db.close();
            });


        });
    });


            


        socket.join(private_channel);
            io.to(private_channel).emit('messages',{
                user:name, 
                msg:" joined"});

           // name=username;
            user.push(data.touser);
        
            //socket.emit('tryagain');

        

    });
  






  socket.on('chat message', function(msg){
    io.emit('messages', msg);
    //add chat to db.
    var touser=msg.touser;

    MongoClient.connect(url,function(err,db){
        assert.equal(null,err);

        function addmessage(db,callback){
           var collection= db.collection("user");
           collection.update({"rollNo":msg.user},
           {
            $push : {messages.(touser) : msg.msg}
           })
        }

    })



  });
  
  socket.on('disconnect',function () {
    io.emit('messages',{user:name,msg:" disconnected"})
      // body...
  })





});
    
 




    // listen (start app with node server.js) ======================================
    http.
    (8080);
    console.log("App listening on port 8080");


