const express = require("express");
const { MongoClient, ObjectID } = require("mongodb"); //uses object destructuring. mongoclient = require('mondodb'.mongoclient
//const db = require('./config/db');
//MongoClient.connect(db.url, (err, db) => {});
MongoClient.connect(`mongodb://localhost:27017/ToDoApp`, (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    let db = client.db("ToDoApp");
    let todos = db.collection("Todos");
    //Delete Many
    // todos
    //     .deleteMany({
    //         text: "Eat Lunch",
    //     })
    //     .then(result => {
    //         console.log(result);
    //     })
    //     .catch(err => {
    //         console.log(" Can't connect to db: ", err);
    //     });
    // client.close();

    //Delete One
    // todos
    //     .deleteOne({
    //         text: "Eat Lunch",
    //     })
    //     .then(result => {
    //         console.log(result);
    //     })
    //     .catch(err => {
    //         console.log(" Can't connect to db: ", err);
    //     });
    // client.close();

    //findOneAndDelete
    todos
        .findOneAndDelete({
            text: "Eat Lunch",
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(" Can't connect to db: ", err);
        });
    client.close();
});