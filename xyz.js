var express = require ("express");
var app= express();


app.get('/home',function(req,res){
	res.send({Mam:"Please dont worry !"});

});

app.get('/acheivement',function(req,res){
	res.send({Mam:"Please dont worry !"});

});

app.get('/Qual',function(req,res){
	res.send({Mam:"Please dont worry !"});

});

app.get('/Aim',function(req,res){
	res.send({Mam:"Please dont worry !"});

});


app.listen(8040);
console.log("Server listening at port 8040");
