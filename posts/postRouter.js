const express = require("express");

const router = express.Router();
const postDB = require("../posts/postDb.js");

//GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await postDB.get();
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(400).json({ Message: "There are no posts to retrieve." });
    }
  } catch (error) {
    res.status(500).json({
      Message: "There was an error while retrieving posts from database."
    });
  }
});

//GET POST BY POST ID
router.get("/:id", validatePostId, async (req, res) => {
  try {
    res.status(200).json(req.post);
  } catch (error) {
    res.status(500).json({
      Message: "There was an error white retrieving the post for the id."
    });
  }
});

router.delete("/:id", validatePostId, async (req, res) => {
  try {
    const deletePost = await postDB.remove(req.params.id);
    res.status(200).json(deletePost);
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was a error while deleting the post." });
  }
});

router.put("/:id", validatePostId, async (req, res) => {
  try {
    console.log("temp");
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while updating the posts." });
  }
});

// custom middleware

// This is a custom middleware function to validate post Id
// The following validations have been performed.
// 1. Check if the id exist in the req params.
// 2. Check if id is not null 0 or empty string
// 3. Check if the id is available in the database
async function validatePostId(req, res, next) {
  if (req.params.id) {
    if (req.params.id !== 0 && req.params.id !== null && req.params.id !== "") {
      const post = await postDB.getById(req.params.id);
      if (post) {
        console.log(":: POST FOR POST ID IS ::" + JSON.stringify(post));
        req.post = post;
        next();
      } else {
        res.status(400).json({
          Message: "No post available for this post id in the database."
        });
      }
    } else {
      res
        .status(400)
        .json({ Message: "The post id provided is either null or empty." });
    }
  } else {
    res.status(400).json({ Message: "There is no post id available." });
  }
}

//This is a custom middleware to validate a post
// Following are the validations:
// 1. Validates the bod on a request to create a new post
// 2. validate if request body is not missing else 400
// 3. validate if the request body has the text field
function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ Message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ Message: "Missing post data." });
  }
}

module.exports = router;
