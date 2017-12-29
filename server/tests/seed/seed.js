const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

let users = [{
    
}, {

}];
let todos = [{
    _id: new ObjectID(),
    text: "First todo",
}, {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 333,
}];

let populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, populateTodos};