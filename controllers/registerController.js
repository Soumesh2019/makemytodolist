const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerContoller = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  userModel.findOne({ email: email }, (err, foundUser) => {
    if (!foundUser) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (!err) {
          const user = new userModel({
            username: username,
            email: email,
            password: hash,
          });
          user.save((err, result) => {
            if (!err) {
              res.setHeader("set-cookie", [
                "isLoggedIn= true; httponly",
                `userId= ${result._id}; httponly`,
              ]);
              res.redirect("/user/" + result._id);
            }
          });
        } else {
          console.log(err);
          res.redirect("/register");
        }
      });
    } else {
      res.render("register", {
        error: "User already Exists",
      });
    }
  });
};

module.exports = registerContoller;
