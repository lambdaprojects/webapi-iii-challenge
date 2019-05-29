const express = require("express");

const router = express.Router();
const postDB = require("../posts/postDb.js");

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

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
