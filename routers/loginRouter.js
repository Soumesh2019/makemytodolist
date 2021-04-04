const express = require("express");
const router = express.Router();

const loginController = require("../controllers/loginController");

router
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      error: "",
    });
  })

  .post(loginController);

module.exports = router;
