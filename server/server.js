const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

require("./config/config");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");
const {authenticate} = require("./middleware/authenticate");

var app = express();
var port = process.env.PORT;
app.use(bodyParser.json());
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });
    todo.save().then((doc, err) => {
        return res
            .status(200)
            .send({doc});
    }).catch((err) => {
        return res
            .status(400)
            .send(err);
    });
});
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id,
    }).then((todos, err) => {
        if (err) {
            return res
                .status(400)
                .send(err);
        } else {
            return res.send({todos});
        }
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    const todoId = req.params.id;
    if(!ObjectID.isValid(todoId)) {
        return res
            .status(400)
            .send('Invalid Id');
    } else {
        Todo.findOne({
          _id: todoId,
          _creator: req.user._id,
        }).then((todo, err) => {
            if(err) {
                return res
                    .status(400)
                    .send('Exception: ' + err.message);
            } else if(!todo){
                return res
                    .status(404)
                    .send('Todo not found');
            } else {
                return res
                    .status(200)
                    .send({todo});
            }
        });
    }
});

app.delete('/todos/:id', authenticate, (req, res) => {

    const todoId = req.params.id;
    if(!ObjectID.isValid(todoId)) {
        return res
            .status(400)
            .send('Invalid Id');
    }
    Todo.findOneAndRemove({
        _id: todoId,
        _creator: req.user._id,
    }).then((todo, err) => {
        if(!todo){
            return res
                .status(404)
                .send('Todo not found');
        }
        else if(err) {
            return res
                .status(400)
                .send('Exception: ' + err.message);
        } else {
            return res
                .status(200)
                .send({todo});
        }

    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(400).send('Invalid id');
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id,
    }, {
      $set: body
    }, {
      new: true
    }).then((todo) => {
        if(!todo) {
          return res.status(404).send('Todo not found');
        }
        return res.send({todo});
    }).catch((err) => {
        return res.status(400).send(err.message);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


app.get('/users/me', authenticate, (req, res) => {
    return res.send(req.user);
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    var user = new User({
        email: body.email,
        password: body.password,
    });
    user.save().then(() => user.generateAuthToken())
        .then((token) => {
        console.log(`Received token ${token}`);
        return res
            .status(200)
            .header('x-auth', token)
            .send(user);
    }).catch((err) => {
        return res
            .status(400)
            .send(err);
    });
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            return res
                .status(200)
                .header('x-auth', token)
                .send(user);
        });
    }).catch((err) => {
        return res
            .status(400)
            .send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res
            .status(200)
            .send();
    }).catch((err) => {
        res
            .status(400)
            .send();
    });
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
