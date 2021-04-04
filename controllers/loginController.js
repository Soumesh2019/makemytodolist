const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const loginController = (req, res) => {
  const email = req.body.email;
  const userpassword = req.body.password;

  userModel.findOne({ email: email }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(
          userpassword,
          foundUser.password,
          function (err, result) {
            if (result) {
              res.setHeader("set-cookie", [
                "isLoggedIn= true; httponly",
                `userId= ${foundUser._id}; httponly`,
              ]);
              res.redirect("/user/" + foundUser._id);
            } else if (err) {
              console.log(err);
            } else {
              res.render("login", {
                error: "Wrong passsord",
              });
            }
          }
        );
      } else {
        res.render("login", {
          error: "User not Found",
        });
      }
    } else {
      console.log(err);
      res.redirect("/login");
    }
  });
};

module.exports = loginController;
