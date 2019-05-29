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

router.get("/:id", async (req, res) => {
  try {
    console.log(`:: REQUEST PARAMS ID IS :: ${req.params.id}`);
    const user = await userDB.getById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ Message: "The user id is not valid." });
    }
  } catch {
    console.log(`:: ERROR IN GET USER WITH ID :: ${error}`);
    res
      .status(500)
      .json({ ErrorMessage: "There was an error while retrieving the user." });
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const userPosts = await userDB.getUserPosts(req.params.id);
    console.log(`:: USER POSTS - :: ${JSON.stringify(userPosts)}`);
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

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const user = await userDB.getById(userId);
      if (user) {
        const deleteUser = await userDB.remove(userId);
        res.status(200).json(deleteUser);
      } else {
        res.status(400).json({ Message: "Invalid user id" });
      }
    } else {
      res
        .status(404)
        .json({ Message: "A user id is required for the delete operation" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ Message: "There was an error while deleting the user." });
  }
});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
