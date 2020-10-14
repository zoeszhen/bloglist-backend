const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

/** For rest client
 * Create new user
  POST http://localhost:3003/api/user
  content-type: application/json

  {
    "username": "test username2",
    "name": "tester1",
    "password": "testPassword1"
  }
   */
usersRouter.post('/', async (request, response) => {
  const { body } = request;

  if (body.username.length < 3 || body.password.length < 3) {
    return response
      .status(400)
      .send('Username or password is too short, be more than 3 characters')
      .end();
  }

  const existUser = await User.findOne({ username: body.username });

  if (existUser) {
    return response
      .status(400)
      .send('User already exist, please login')
      .end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  console.log('savedUser', savedUser);
  response.json(savedUser);
});

// GET http://localhost:3003/api/user
usersRouter.get('/', async (_, response) => {
  try {
    const users = await User.find({});
    response.status(200).json(users);
  } catch (error) {
    response.status(400).json(error).end();
  }
});

module.exports = usersRouter;
