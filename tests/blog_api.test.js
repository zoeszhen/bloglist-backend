const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('create blogs successful', async () => {
  const beforeCreated = await api.get('/api/blogs');
  await api
    .post('/api/blogs')
    .send({
      author: 'test author3',
      title: 'test title3',
      url: 'https://testtitle.com1',
      likes: 3,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const afterCreated = await api.get('/api/blogs');
  expect(afterCreated.body.length - beforeCreated.body.length).toEqual(1);
});

test('should set to 0, If like is missing from request, ', async () => {
  const target = await api
    .post('/api/blogs')
    .send({
      author: 'test author3',
      title: 'test title3',
      url: 'https://testtitle.com1',
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const afterCreated = await api.get('/api/blogs');
  const targetBlog = afterCreated.body.find(({ id }) => id === target.body.id);
  expect(targetBlog.likes).toEqual(0);
});

test('should recive 400, if title or url is missing from request,', async () => {
  await api
    .post('/api/blogs')
    .send({
      author: 'test author3',
      likes: 1,
    })
    .expect(400)
    .expect('Bad Request');
});
// test('Unique identifier property of the blog posts is named id ', async () => {
//   const res = await api.get('/api/blogs');
//   const ids = res.body.map(({ id }) => id);
//   expect(res.body[0]["_id"]).toBeDefined();
// });

test('should return 400, if password is less than 3 characters', async () => {
  await api
    .post('/api/user')
    .send({
      username: 'test',
      name: 'tester1',
      password: 'te',
    })
    .expect(400)
    .expect('Username or password is too short, be more than 3 characters');
});

test('should return 400, if username is less than 3 characters', async () => {
  await api
    .post('/api/user')
    .send({
      username: 'te',
      name: 'tester1',
      password: 'testpassword',
    })
    .expect(400)
    .expect('Username or password is too short, be more than 3 characters');
});

test('should return 400 user exist error, if username is already exist', async () => {
  await api
    .post('/api/user')
    .send({
      username: 'test',
      name: 'tester1',
      password: 'testpassword',
    })
    .expect(400)
    .expect('User already exist, please login');
});

afterAll(() => {
  mongoose.connection.close();
});
