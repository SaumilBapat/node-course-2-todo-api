const expect = require('chai').expect;
const should = require('chai').should();
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {users, populateUsers, todos, populateTodos} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text: "test"})
            .expect(200)
            .expect((res) => {
                (res.body.doc.text).should.equal("test");
                done();
            })
            .catch((err) => done(err));
    });

    it('Should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({text: ''})
            .expect(400)
            .expect((res) => {
                (res.body.name).should.equal('ValidationError');
                done();
            })
            .catch((err) => done(err));
    });
});
describe('GET /todos/:id', () => {
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
                  (todo._id.toString()).should.equal(res.body.todo._id);
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
            .get('/todos/abc1')
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
            let todo = todos[0];
            return todo;
        }).then((todo) => {
          request(app)
              .del('/todos/' + todo._id)
              .expect(200)
              .catch((err) => done(err));
            return todos;
        }).then((todos) => {
            Todo
                .findById(todos[0]._id)
                .then((todo) => {
                    should.equal(todo, null);
                    done();
                })
                .catch((err) => done(err));
        }).catch((err) => done(err));
    });
    it('Should return 404 if todo is not found', (done) => {
        request(app)
            .delete('/todos/abceee2af7bc913c572b0ba9')
            .expect(404)
            .catch((err) => done(err));
            done();
    });
    it('Should return a 400 if invalid id is passed in', (done) => {
        request(app)
            .delete('/todos/abc2')
            .expect(400)
            .catch((err) => done(err));
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
                    }).then((todo) => done());
                }).catch((err) => done(err));
        });
    });
    it('Should return 404 if todo is not found', (done) => {
        request(app)
            .patch('/todos/abceee2af7bc913c572b0ba9')
            .expect(404)
            .catch((err) => done(err));
            done();
    });
    it('Should return a 400 if invalid id is passed in', (done) => {
        request(app)
            .patch('/todos/abc3')
            .expect(400)
            .catch((err) => done(err));
            done();
    });
    it('should clear completedAt when todo is not completed', (done) => {
      let todoData = [{
          text: "First todo",
      },{
          text: "Second todo",
      }];
      Todo.insertMany(todoData).then((todos) => {
          return todos;
      }).then((todos) => {
        let hexId = todos[1]._id.toHexString();
        let text = 'This is the new text';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: false,
          text
        })
        .expect(200)
        .expect((res) => {
          should.equal(res.body.todo.text, text);
          should.equal(res.body.todo.completed, false);
          should.equal(res.body.todo.completedAt, null);
          done();
        }).catch((err) => done(err));
      });
    });
});
describe('Get /users/me', () => {
  it('Should return user if authenticated', (done) => {

    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      (res.body._id).should.equal(users[0]._id.toString());
      done();
    }).catch((err) => done(err));
  });
  it('Should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      should.equal(request.body, undefined);
    })
    .catch((err) => done(err));
    done();
  });
  describe('POST /users', () => {
    it('Should create a user', (done) => {
      let email = 'test@test.com';
      let password = 'test1234';
      request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        should.exist(res.headers['x-auth']);
        should.exist(res.body._id);
        should.equal(res.body.email, email);
      }).end((err) => {
        if (err) {
          done(err);
        }
        User.findOne({email}).then((user) => {
          should.exist(user);
          should.not.equal(user.password, password);
          done();
        });
      });
    });
    it('Should return a validation error for invalid request', (done) => {
      const email = '1';
      const password = 'test1234';
      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
    });
    it('Should not create a user if email is used', (done) => {
      const email = 'andrew2@example.com';
      const password = 'test1234';
      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
    });
  });

    describe('Get /users/me', () => {
        it('Should login user and return auth token', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password,
                })
                .expect(200)
                .expect((res) => {
                    should.exist(res.headers['x-auth']);
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                    User.findById(users[1]._id).then((user) => {
                        (user.tokens[0]).should.include({
                            access: 'auth',
                            token: res.headers['x-auth'],
                        });
                        done();
                    }).catch((err) => done(err));
                });
        });
        it('Should Reject invalid login', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: 'Invalid',
                })
                .expect(400)
                .expect((res) => {
                    should.not.exist(res.headers['x-auth']);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
