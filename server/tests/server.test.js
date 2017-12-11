const expect = require('chai').expect;
const request = require('supertest');

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
});