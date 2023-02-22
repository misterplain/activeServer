const express = require("express");
const router = express.Router();
const blogsController = require("../../controllers/bcnMinimalista/blogsController");

router.route("/").get(blogsController.getAllBlogs);

router
  .route("/")
  .post(blogsController.addBlog)
  .delete(blogsController.deleteBlog);

module.exports = router;
