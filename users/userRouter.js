const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const user = await Users.insert(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error adding new user." });
  }
});

router.post("/:id/posts", validatePost, async (req, res) => {
  const postInfo = { ...req.body, post_id: req.params.id };

  try {
    const post = await Posts.insert(postInfo);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await Users.get(req.query);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving users." });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving user." });
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Users.getUserPosts(id);

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting posts for user." });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await Users.remove(id);

    res.status(200).json({ message: "User has been removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User could not be removed." });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  try {
    const user = await Users.update(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(500).json({ message: "Error updating the user." });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Users.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function validateUser(req, res, next) {
  try {
    const userBody = await req.body;

    if (userBody.name === "") {
      res.status(400).json({ message: "Missing required name field." });
    } else if (userBody.body === "") {
      res.status(400).json({ message: "Missing required text field." });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function validatePost(req, res, next) {
  const post = await req.body;
  try {
    if (!post) {
      res.status(400).json({ message: "Missing post data." });
    } else if (post.text === "") {
      res.status(400).json({ message: "Missing required text field." });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
