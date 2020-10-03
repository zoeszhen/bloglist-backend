const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
// GET http://localhost:3003/api/blogs
blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs);
    });
});

/** For rest client
  POST http://localhost:3003/api/blogs HTTP/1.1
  content-type: application/json
  {
      "author": "test author1",
      "title": "test title1",
      "url": "https://testtitle1.com",
      "likes": 2
  }
   */

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    });
});
module.exports = blogsRouter;
