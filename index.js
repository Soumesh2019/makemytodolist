const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const saltRounds = 10;
let isLoggedIn = false;

mongoose.connect("mongodb://localhost:27017/toDoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userModel = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

// Register The User

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userModel.findOne({ username: username }, (err, foundUser) => {
      if (!foundUser) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (!err) {
            const user = new userModel({
              username: username,
              password: hash,
            });

            user.save((err) => {
              if (!err) {
                isLoggedIn = true;
                res.redirect("/todo");
              }
            });
          } else {
            console.log(err);
            res.redirect("/login");
          }
        });
      } else {
        res.send("User already exists");
      }
    });
  });

//   Login The User

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const userpassword = req.body.password;

    userModel.findOne({ username: username }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(userpassword, foundUser.password, function (
            err,
            result
          ) {
            if (result) {
              isLoggedIn = true;
              res.redirect("/todo");
            } else if (err) {
              console.log(err);
            } else {
              res.send("Wrong passsord");
            }
          });
        } else {
          console.log("User not Found");
          res.redirect("/register");
        }
      } else {
        console.log(err);
        res.redirect("/login");
      }
    });
  });

//   Todo Section

app.route("/todo").get((req, res) => {
  if(isLoggedIn) {
      res.render("todo")
  } else {
      res.redirect("/login")
  }
});

app.post("/logout", (req, res)=> {
    isLoggedIn = false;
    res.redirect("/")
})


app.listen(3000, () => console.log("Server is running on 3000"));
