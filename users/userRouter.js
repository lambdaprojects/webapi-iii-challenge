const express = require("express");

const router = express.Router();

const userDB = require("./userDb.js");

router.post("/", (req, res) => {});

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
    console.log(`:: REQUEST PARAMS ID IS :: ${JSON.stringify(user)}`);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ Message: "The user id is not valid." });
    }
  } catch {
    console.log(`:: ERROR IN GET USER WITH ID :: ${error}`);
    res
      .status(500)
      .json({ ErrorMessage: "There was an error while retrieving the user." });
  }
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
