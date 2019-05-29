const express = require("express");

const router = express.Router();

const userDB = require("./userDb.js");
const postDB = require("../posts/postDb.js");

// ADD A USER
router.post("/", validateUser, async (req, res) => {
  try {
    const user = await userDB.insert(req.body);
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while inserting the user." });
  }
});

//ADD A POST ASSOCIATED TO A USER
router.post("/:id/posts", validatePostId, validatePost, async (req, res) => {
  try {
    const userId = req.params.id;
    req.body.user_id = userId;
    const addPost = await postDB.insert(req.body);
    res.status(200).json(addPost);
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while trying to insert posts." });
  }
});

//GET ALL THE USERS
router.get("/", async (req, res) => {
  try {
    const users = await userDB.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(`:: ERROR IN GET USERS :: ${error}`);
    res.status(500).json({ ErrorMessage: "Could not retrieve the users." });
  }
});

//GET THE USER BY ID
router.get("/:id", validateUserId, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ ErrorMessage: "There was an error while retrieving the user." });
  }
});

//GET THE POSTS OF A PARTICULAR USER BY THE USER ID
router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const userPosts = await userDB.getUserPosts(req.params.id);
    if (userPosts.length > 0) {
      res.status(200).json(userPosts);
    } else {
      res
        .status(400)
        .json({ Message: "There are no posts associated with this user." });
    }
  } catch (error) {
    res.status(500).json({
      Message: "There was an error while retrieving the posts for the userId."
    });
  }
});

//DELETE A PARTICULAR USER BY ID
router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await userDB.remove(userId);
    res.status(200).json({ Message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while deleting the user." });
  }
});

//UPDATE A USER
router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUser = await userDB.update(userId, req.body);
    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while updating the user." });
  }
});

// custom middleware

// This is a custom middleware to test if the userId is valid.
// Following are the validations:
// 1. Is the id available in params
// 2. Is the id not null or 0 or ''
// 3. Is the id available in the database

async function validateUserId(req, res, next) {
  const userId = req.params.id;
  if (userId) {
    if (userId !== null && userId !== "" && userId !== 0) {
      const user = await userDB.getById(userId);
      if (user) {
        req.user = user;
        next();
      } else {
        res
          .status(400)
          .json({ Message: "This user does not exist in the database." });
      }
    } else {
      res.status(400).json({ Message: "Not a valid user Id." });
    }
  } else {
    res.status(400).json({
      Message: "There is no user id. User id must be available in request."
    });
  }
}

//This is a custom middleware to validate the user
// Following are the validations:
// 1. validates the body on a request to create a new user
// 2. Validate if request body is not missing else 400
// 3. Validate if the request body has the name field
function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ Message: "Missing required name field" });
    }
  } else {
    res.status(400).json({ Message: "Missing user data." });
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

module.exports = router;
