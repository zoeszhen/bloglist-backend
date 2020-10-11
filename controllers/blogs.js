const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
// GET http://localhost:3003/api/blogs
blogsRouter.get('/', async (_, response) => {
  try {
    const blogs = await Blog.find({});
    response.status(200).json(blogs);
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
    "likes": 3
  }
   */

blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
  });

  if (!body.title && !body.url) {
    response.status(400).send('Bad Request').end();
  } else {
    try {
      const results = await blog.save();
      response.status(201).json(results);
    } catch (error) {
      response.status(400).json(error).end();
    }
  }
});

/** For rest client
  Delete http://localhost:3003/api/blogs
  content-type: application/json

  {
    "id": "5f74c0aa7f1523ea3643b26a"
  }
   */

blogsRouter.delete('/', async (request, response) => {
  const blogs = await Blog.find({});
  const index = blogs.findIndex((item) => item.id === request.body.id);
  try {
    const res = await blogs[index].remove();
    response.status(200).json(res);
  } catch (error) {
    response.status(400).json(error).end();
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
