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
  username: {
    type: String,
    required: [true, "Please Provide username"],
  },
  password: {
    type: String,
    required: [true, "Please Provide password"],
  },
  email: {
    type: String,
    required: [true, "Please Provide email"],
  },
  toDoItem: Array,
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
                isLoggedIn = true;
                res.redirect("/user/" + result._id);
              }
            });
          } else {
            console.log(err);
            res.redirect("/register");
          }
        });
      } else {
        res.send("User already exists");
      }
    });
  });

// Login The User
app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.email;
    const userpassword = req.body.password;

    userModel.findOne({ email: email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(userpassword, foundUser.password, function (
            err,
            result
          ) {
            if (result) {
              isLoggedIn = true;
              res.redirect("/user/" + foundUser._id);
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

// Todo Section
app.get("/user/:userId", (req, res) => {
  if (isLoggedIn) {
    const userId = req.params.userId;
    userModel.findOne({ _id: userId }, (err, foundUser) => {
      if (!err) {
        res.render("todo", {
          userId: userId,
          name: foundUser.username,
          itemsArray: foundUser.toDoItem,
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/submit", (req, res) => {
  const userId = req.body.userId;
  const item = req.body.item;

  userModel.updateOne(
    { _id: userId },
    { $push: { toDoItem: item } },
    (err, result) => {
      if (!err) {
        res.redirect("/user/" + userId);
      } else if (err) {
        console.log(err);
        res.send(new Error(err));
      }
    }
  );
});

app.post("/completed", (req, res) => {
});

app.post("/logout", (req, res) => {
  isLoggedIn = false;
  res.redirect("/login");
});

app.listen(3000, () => console.log("Server is running on 3000"));
