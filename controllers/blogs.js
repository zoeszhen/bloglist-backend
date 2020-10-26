const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

// GET http://localhost:3003/api/blogs
blogsRouter.get('/', async (_, response) => {
  try {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs.map((blog) => blog.toJSON()));
  } catch (error) {
    response.status(400).json(error).end();
  }
});

/** For rest client
  POST http://localhost:3003/api/blogs
  content-type: application/json

  {
    "author": "test author3",
    "title": "test title3",
    "url": "https://testtitle.com1",
    "likes": 3,
    "userId": "5f83386a001b7d184d60fb11"
  }
   */

blogsRouter.post('/', async (request, response) => {
  const { body } = request;

  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user.id,
  });

  if (!body.title && !body.url) {
    response.status(400).send('Bad Request').end();
  } else {
    try {
      const results = await blog.save();
      user.notes = user.blogs.concat(results.id);
      response.status(201).json(results);
    } catch (error) {
      response.status(400).json(error).end();
    }
  }
});

/** For rest client
  Delete http://localhost:3003/api/blogs/5f74c0aa7f1523ea3643b26a
  content-type: application/json

  {
    "id": "5f74c0aa7f1523ea3643b26a"
  }
   */

blogsRouter.delete('/:id', async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const user = await User.findOne({ username: decodedToken.username });

  const blog = await Blog.findById(request.params.id);
  try {
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).end();
    }
  } catch (exception) {
    next(exception);
  }
});

/** For rest client
  PUT http://localhost:3003/api/blogs/5f7dead026a4eda64b561e1b
  content-type: application/json

  {
    "id": "5f7dead026a4eda64b561e1b",
    "author": "test author3",
    "title": "test title3",
    "url": "https://testtitle.com1",
    "likes": 3
  }
   */

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;
  try {
    const res = Blog.findOneAndUpdate(
      { _id: body.id },
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
      },
    );
    response.status(200).json(res);
  } catch (error) {
    response.status(400).json(error).end();
  }
});

module.exports = blogsRouter;
