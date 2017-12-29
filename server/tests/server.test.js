const expect = require('chai').expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos} = require('./seed/seed');

beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text: "test"})
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).to.equal("test");
            }).catch((err) => done(err));
        done();
    });

    it('Should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({text: ''})
            .expect(400)
            .expect((res) => {
                expect(res.body.name).to.equal('ValidationError');
            }).catch((err) => done(err));
        done();
    });
});
describe('POST /todos/:id', () => {
    it('Should return the todo with the sent id', (done) => {
        let todos = [{
            text: "First todo",
        },{
            text: "Second todo",
        }];
        Todo.insertMany(todos).then((todos) => {
            let todo = todos[0];
            return todo;
        }).then((todo) => {
            request(app)
                .get('/todos/' + todo._id)
                .expect(200)
                .expect((res) => {
                    expect(todo._doc._id.toHexString()).to.equal(res.body.todo._id);
                    //expect(JSON.stringify(todo)).to.equal(JSON.stringify(res.body.todo));
                    done();
                }).catch((err) => done(err));
        });
    });
    it('Should return 404 if todo is not found', (done) => {
        request(app)
            .get('/todos/abceee2af7bc913c572b0ba9')
            .expect(404)
            .catch((err) => done(err));
        done();
    });
    it('Should return a 400 if invalid id is passed in', (done) => {
        request(app)
            .get('/todos/abc')
            .expect(400)
            .catch((err) => done(err));
        done();
    });
});
describe('DELETE /todos/:id', () => {
    it('Should delete the todo with the sent id', (done) => {
        let todos = [{
            text: "First todo",
        },{
            text: "Second todo",
        }];
        Todo.insertMany(todos).then((todos) => {
            return todos[0];
        }).then((todo) => {
            request(app)
            .delete('/todos/' + todo._id)
            .expect(200)
            .expect((res) => {
                expect(todo._doc._id.toHexString()).to.equal(res.body.todo._id);
            });
            return todo;
        }).then((todo) => {
            Todo
                .findById(todo._id)
                .then((todo) => {
                    expect(todo).to.be.null;
                })
                .catch((err) => done(err));
        }).catch((err) => done(err));
        done();
    });
    it('Should return 404 if todo is not found', (done) => {
        request(app)
            .delete('/todos/abceee2af7bc913c572b0ba9')
            .expect(404);
        done();
    });
    it('Should return a 400 if invalid id is passed in', (done) => {
        request(app)
            .delete('/todos/abc')
            .expect(400);
        done();
    });
});
describe('PATCH /todos/:id', () => {
    it('Should update the todo with the sent id', (done) => {
        let todoData = [{
            text: "First todo",
        },{
            text: "Second todo",
        }];
        Todo.insertMany(todoData).then((todos) => {
            return todos[0];
        }).then((todo) => {
            request(app)
                .patch('/todos/' + todo._id)
                .send({text: 'Updated via patch'})
                .expect(200)
                .expect((res) => {
                    Todo.find({_id: new ObjectID(res.body.todo._id)}).then((todos) => {
                        expect(todos[0].text).to.equal('Updated via patch');
                    });
                    done();
                }).catch((err) => done(err));
        });
    });
    it('Should return 404 if todo is not found', (done) => {
        request(app)
            .patch('/todos/abceee2af7bc913c572b0ba9')
            .expect(404);
        done();
    });
    it('Should return a 400 if invalid id is passed in', (done) => {
        request(app)
            .patch('/todos/abc')
            .expect(400);
        done();
    });
});
