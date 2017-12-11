const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");

var app = express();
app.use(bodyParser.json());
app.post('/Todos', (req, res) => {
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
app.get('/Todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
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
