// server.js

    // set up ========================
  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);


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
   // app.use(session({secret: 'ssshhhhh'}));

    
    // // define model =================
    // var Todo = mongoose.model('Todo', {
    //     rollNo : String,
    //     password : String
    // });



// routes ======================================================================

    app.get('/home', function(req, res) {
        
             res.sendfile("./home.html");
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
                                                
                                    
                                      
                                        





    //     var pass=todo.findOne({ 'rollNo':req.body.rollNo }, function (err, todo) {
    //   if (err) return handleError(err);
    //   if(pass.password==req.body.password){
    //    var sess=req.session;
    //    console.log("Welcome"+sess);
    //   }

    // })
    // })
    //         //  api ---------------------------------------------------------------------
            //get all todos
    app.get('/login', function(req, res) {
        //console.log(req.body.do);
      // if (req.params.do=="just load it!")
             res.sendfile('./login.html');
            
       //  else{   var todos=req;
       //  // use mongoose to get all todos in the database
       // Todo.find(function(err, todos) {
       //          if (err)
       //              res.send(err)
               
       //              if (todos.password)
       //                      console.log('User exist');
       //         //res.send(req);
       //         //res.json(todos);
       //      });
       //  }
    });

    // create todo and send back all todos after creation
    app.post('/register', function(req, res) {
               MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              checkpresenceandadd(db, function() {
                  db.close();
                 // return "done"
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
           // console.log(check);

           //  if (typeof (check) != "undefined")
           //      return res.send("Fucking user already exist");
           // else
           //  {
           //      db.collection("user").insertOne({            
           //  "rollNo" : req.body.rollNo,
           //   "password" : req.body.password,},
           //   function(err, result) {
           //                      assert.equal(err, null);
           //                      console.log("Inserted a document into the restaurants collection.");
                               
           //                      callback();


           //                      });
           //    }  

                         
        
                 });  
                               



       // console.log(req);
        // create a todo, information comes from AJAX request from Angular
      // console.log(req.body);
       // var todo = new Todo({            
       //      rollNo : req.body.rollNo,
       //      password : req.body.password,
                   // var todos=req;
       //  // use mongoose to get all todos in the database
       // get and return all the todos after you create another
            // Todo.find({ 'rollNo':req.body.rollNo },function(err, todos) {
            //     if (err)
            //           res.send(err)
            //     console.log(todos)
            //     res.send(todos);
            //  }




       // var todo = new Todo({            
       //      rollNo : req.body.rollNo,
       //      password : req.body.password,
       
//console.log (todo);
       
           // get and return all the todos after you create another
            // Todo.find({ 'rollNo':req.body.rollNo },function(err, todos) {
            //     if (err)
            //           res.send(err)
            //     console.log(todos)
            //     res.send(todos);
            // });

  //      });

//    });
    
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    // delete a todo
   /*
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    */


    // socket programming

    io.on("connection",function (socket) {
        console.log("a user connected");
        socket.on('chatmessage', function(data){
              io.emit('chat message', data);
  });
    });





    // listen (start app with node server.js) ======================================
    http.listen(8080);
    console.log("App listening on port 8080");


