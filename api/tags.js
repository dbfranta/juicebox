const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
  res.send({
   tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  //console.log("req.params.tagName", req.params.tagName)
  const tagName = req.params.tagName;
  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName)
    const posts = allPosts.filter(post => {
      if(post.active && post.author.id === req.user.id) {
        return true;
      }
    })
    // send out an object to the client { posts: // the posts }
    //console.log(posts, tagName)
    res.send({
      posts: posts
    })
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    console.log({ name, message });
    next({ name, message });
  }
});



module.exports = tagsRouter;

