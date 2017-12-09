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
  //Find using filters eg. todos.find({completed: true}).
  todos
    .find({
      _id: new ObjectID("5a2b1e931f6a2f6804956665")
    })
    .toArray()
    .then(docs => {
      console.log(docs);
    })
    .catch(err => {
      console.log(" Can't connect to db: ", err);
    });
  /*
    todos.insertOne({
        name: "Saumil Bapat",
        age: 29,
        location: "Toronto"
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err); //return and stop function execution
        }
        console.log("Created at:",
            JSON.stringify(result.ops[0]["_id"].getTimestamp(), undefined, 2)); //ops attribute stores all the inserted docs
    });
    */
  client.close();
});
