const totalLikes = (blogs) => blogs.reduce((init, { likes }) => init + likes, 0);
const favoriteBlog = (blogs) => {
  const fav = blogs.sort((a, b) => b.likes - a.likes)[0];
  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  };
};
const mostBlogs = (blogs) => blogs.reduce((init, blog) => {
  const match = init.find((initBlog) => initBlog.author === blog.author);
  if (!match) {
    init.push({
      author: blog.author,
      blogs: 1,
    });
    return init;
  }
  match.blogs += 1;
  return init.map((mapBlog) => (mapBlog.author === blog.author ? match : mapBlog));
}, [])
  .sort((a, b) => b.blogs - a.blogs)[0];

const mostLikes = (blogs) => blogs.reduce((init, blog) => {
  const match = init.find((initBlog) => initBlog.author === blog.author);
  if (!match) {
    init.push({
      author: blog.author,
      likes: blog.likes,
    });
    return init;
  }
  match.likes += blog.likes;
  return init.map((mapBlog) => (mapBlog.author === blog.author ? match : mapBlog));
}, [])
  .sort((a, b) => b.likes - a.likes)[0];

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
