const express = require("express");
const router = express.Router();

const registerContoller = require("../controllers/registerController");

router
  .route("/register")
  .get((req, res) => {
    res.render("register", {
      error: "",
    });
  })
  .post(registerContoller);

module.exports = router;
