const express = require("express");

const router = express.Router();

const userDB = require("./userDb.js");

router.post("/", async (req, res) => {
  try {
    if (!req.body) {
      res.status(404).json({ Message: "The request body is empty" });
    } else {
      if (!req.body.name) {
        res
          .status(404)
          .json({ Message: "The request body does not have a user name." });
      } else {
        const user = await userDB.insert(req.body);
        res.status(200).json(user);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while inserting the user." });
  }
});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const users = await userDB.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(`:: ERROR IN GET USERS :: ${error}`);
    res.status(500).json({ ErrorMessage: "Could not retrieve the users." });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ ErrorMessage: "There was an error while retrieving the user." });
  }
});

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

router.put("/:id", validateUserId, async (req, res) => {
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

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
