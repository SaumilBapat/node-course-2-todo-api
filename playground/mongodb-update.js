const express = require("express");
const { MongoClient, ObjectID } = require("mongodb"); //uses object destructuring. mongoclient = require('mondodb'.mongoclient
MongoClient.connect(`mongodb://localhost:27017/ToDoApp`, (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    let db = client.db("ToDoApp");
    let todos = db.collection("Users");
    //findOneAndDelete
    todos
        .findOneAndUpdate({
            _id : new ObjectID("5a2b1f4ca8dd3468648c4a75"),
        }, {
            $set: {
                name: "Saumil Bapat - Updated",
            },
            $inc: {
                age: 1
            },
        }, {
            returnOriginal: false
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(" Can't connect to db: ", err);
        });
    client.close();
});