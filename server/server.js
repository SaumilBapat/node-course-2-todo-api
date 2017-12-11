const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
        console.log('Failed to save, ', err);
    });
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    if(!ObjectID.isValid(todoId)) {
        res.status(400);
        res.send('Invalid Id');
    }
    Todo.findById(todoId).then((todo) => {
        if(!todo){
            res.status(404);
            res.send('Todo not found');
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400);
        res.send('Exception: ', err.message);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};



// let newTodo = new Todo({
//   text: "Cook dinner",
//   completed: true,
//   completedAt: Date.now()
// });
// newTodo
//   .save()
//   .then(doc => {
//     console.log("Saved todo: ", doc);
//   })
//   .catch(err => {
//     console.log("Unable to save todo: ", err);
//   });

// let newUser = new User({
//   email: "saumil_bapat@hotmail.com"
// });
// newUser
//   .save()
//   .then(doc => {
//     console.log("Saved user: ", doc);
//   })
//   .catch(err => {
//     console.log("Unable to save user: ", err);
//   });
