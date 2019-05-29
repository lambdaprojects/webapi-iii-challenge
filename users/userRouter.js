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
router.post("/:id/posts", (req, res) => {});

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
    res.status(200).json(deleteUser);
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

function validatePost(req, res, next) {}

module.exports = router;
