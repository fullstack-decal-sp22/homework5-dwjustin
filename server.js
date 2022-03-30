const express = require("express");
const port=process.env.PORT || 8080;
const app=express();

var router= express.Router();

app.use(express.json()); //Utilities for request bodies
app.use(express.urlencoded({extended: true})); //Utilities for query params

//Server Setup
app.use('/api', router);

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
});

const mongoose = require('mongoose');
const url = "mongodb://127.0.0.1:27017/database-intro";

mongoose.connect(url, {useNewUrlParser:true});

const db= mongoose.connection;

db.once('open',_=>{
    console.log('Database connected:', url)
});

db.on('error', err=>{
    console.error('connection error: ',err)
});

//create model

const Schema= mongoose.Schema;


const item = new Schema({
    image_url: String,
    date: String,

});

const Result = mongoose.model('Result', item);

//CURD Operations for MongoDB & Express
//Create

router.post("/add",(req, res)=>{
    const result = new Result({
        image_url: req.body.image_url,
        date: req.body.date,
    });
    result.save((error, document)=>{
        if (error){
            res.json({status: "failure"});
        }
        else{
            res.json({
                status:"success",
                id: result._id,
                content: req.body
            });
        }
    });
});

//Retrieve

router.get('/favorite',(req, res)=>{
    Result.find().then((results)=>{
        res.json({message: "Here is the get route.", results: results});
       
    });
});

router.get('/',(req, res)=>{
    res.json({message: "Welcome to the APOD app."});
    
});

//Routers

router.delete('/delete',(req, res)=>{
    
    Result.updateMany({},{$unset: {image_url:""}}, (error, result)=>{
        if(error){
            res.json({status: "failure"});
        }else{
            res.json({message: "Successfully deleted!"})
        }
    });
});


