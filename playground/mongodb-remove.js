const {ObjectID } = require("mongodb");

const {Todo} = require('./../server/models/todo');

Todo.
    .find({
        _id: new ObjectID("5a2eee96a68b6f3c6b3411e9"),
    })
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(" Can't connect to db: ", err);
    });