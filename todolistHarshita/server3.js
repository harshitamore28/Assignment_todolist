const express = require('express')
const {MongoClient} = require('mongodb')
const serverApp = express();
const parser = require('body-parser');

const connString = 'mongodb+srv://harshita:indegene@cluster0.xsiol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
serverApp.use(parser.json())
serverApp.use(parser.urlencoded({extended:false}))

serverApp.set('views','./src/views')
serverApp.set('view engine','ejs')
serverApp.use(express.static("public"));

serverApp.get("/",(req,res)=>{
    res.render("index.ejs")
})

// connecting to mongoDB cluster
MongoClient.connect(connString, (err,client)=>{
    if(err){
        return console.error(err)
    }

    // fetching the database and collection
    const usersDB = client.db('to-do-list');
    const usersCollection = usersDB.collection('list1');
    console.log("connected to database");

    //making route to create to do list info
    serverApp.post('/createList',(req,res)=>{
        usersCollection.insertOne(req.body)
        .then(result=>res.redirect('/getList'))
        .catch(error=>console.error(error))
    }); 

    //making route to get to do list info
    serverApp.get('/getList',async (req,res)=>{
        try{
            list1 = await usersCollection.find().toArray();
            res.render('list1.ejs',{list1:list1})
        } catch(error){
            console.error(error);
        } 
    });

    //making route to update to do list info
    serverApp.put('/updateList',(req,res)=>{
        usersCollection.findOneAndUpdate({
            taskName:req.body.updateList
        },
        {
            $set: {
                taskName:req.body.updateListTo
            }
        },
        {
            upsert:true,
        })
        .then(result=>res.send('info updated'))
        .catch(error=>console.error(error))
    });

    //making route to delete to do list info
    serverApp.delete('/deleteList',(req,res)=>{
        usersCollection.deleteOne({taskName:req.body.name})
        .then(result => {
            if(result.deletedCount === 0)
                return res.send('delete operation failed');
            else
                return res.send('deleted');
        })
        .catch(error => console.error(error))
    });
})

serverApp.listen(5500);