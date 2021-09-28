const express = require('express');
const bodyParser = require('body-parser');
const authRouter = express.Router();





authRouter.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;


const dboper = require('../operations');

const url ='mongodb://localhost:27017/';
const dbname = 'users_db';


authRouter.route('/')
.all((req,res,next)=>{
    console.log(req.url);
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next()

})

.get((req,res,next)=>{
    res.render("new_user")
})

.post((req,res,next)=>{
    MongoClient.connect(url).then(client => {

        console.log('Connected correctly to server');
        const db = client.db(dbname)
        const obj = JSON.parse(JSON.stringify(req.body));
        console.log (obj)

        dboper.insertDocument(db, obj,
        "accounts")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);
            res.render('success',{prod:obj})
        }).catch((err) => console.log(err));
        client.close;
    }).catch((err) => console.log(err));
    
});






authRouter.route('/showall')
.all((req,res,next)=>{
    console.log(req.url);
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next()

})



.get((req,res,next)=>{
    MongoClient.connect(url).then(client => {

        console.log("GET here")
        console.log("GET here")

        console.log('Connected correctly to server');
        const db = client.db(dbname)

        dboper.findDocuments(db, "accounts")
        .then((result) => {
            console.log("Found users:\n", result);
            res.render('showall',{links:result})
        }).catch((err) => console.log(err));
        client.close;
    }).catch((err) => console.log(err));
    
})

authRouter.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
  });

authRouter.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Express' });
  });


module.exports = authRouter;