const expect = require('chai').expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let todos = [{
    text: "First todo",
}, {
    text: "Second todo",
}];
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});
describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        let text = 'Todo test';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(3);
                    expect(todos[2].text).to.equal(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Should not create todo with invalid data', (done) => {
        let text = '';
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.text.message).to.equal("Path `text` is required.");
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((e) => done(e));
            });
    });
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