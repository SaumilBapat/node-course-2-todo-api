const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
let userOneId = new ObjectID();
let userTwoId = new ObjectID();
let users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'andrew2@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];
let todos = [{
    _id: new ObjectID(),
    text: "First todo",
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
}];

let populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

let populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
