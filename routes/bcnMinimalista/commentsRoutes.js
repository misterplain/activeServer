const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/bcnMinimalista/commentsController");
const { protect } = require("../../middleware/bcnMinimalista/authMiddleware");

router.route("/").get(commentsController.getAllComments);

//protected routes requiring authorization
// router.use(verifyJWT);
router.use(protect);
router.route("/").post(commentsController.createNewComment);

router
  .route("/:id")
  .delete(commentsController.deleteComment)
  .patch(commentsController.updateComment);

module.exports = router;
