const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5a2ed0f85ec66fcb771d3afb';
if(!ObjectID.isValid(id)) {
    console.log('Id is not valid');
}
User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found');
    }
    console.log('Found user: ', user);
}).catch((err) => {
    console.log(err.message);
});


// let id = '5a2ec6a1714a93b04a695f29';
// if(!ObjectId.isValid(id)) {
//     console.log('Object id is not valid.');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log("Todos: ", todos);
// });
//
// Todo.findOne({
//     _id: id,
// }).then((todo) => {
//     console.log('Todo find one: ', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo find by Id: ', todo);
// }).catch((err) => {
//     console.log(err.message);
// });