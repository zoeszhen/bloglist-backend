
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog');


app.use(cors())
app.use(express.json())
//For rest client
// http://localhost:3003/api/blogs
app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

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

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})